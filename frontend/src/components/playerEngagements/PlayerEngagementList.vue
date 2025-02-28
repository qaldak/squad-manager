<template>
  <v-card-title>Player engagement</v-card-title>
  <v-row>
    <v-col>
      <v-autocomplete
        :key="autocompleteKey"
        v-model="selectedPlayer"
        :items="allPlayersWithFullName"
        clearable
        item-title="fullName"
        item-value="playerId"
        label="assign player"
        placeholder="enter name or first name"
        @update:modelValue="onPlayerSelection"
      ></v-autocomplete>
    </v-col>
    <v-col class="justify-center">
      <v-radio-group v-model="selectedEngagement" inline>
        <v-radio :label="EngagementStatus.DEFINITIVE" :value="EngagementStatus.DEFINITIVE" />
        <v-radio :label="EngagementStatus.CANCELED" :value="EngagementStatus.CANCELED" />
      </v-radio-group>
    </v-col>
    <v-col class="justify-center">
      <v-btn
        variant="outlined"
        :disabled="!isPlayerAssignable"
        :loading="playerEngagementStore.loading"
        @click="assignPlayer(selectedPlayer)"
        >Assign
      </v-btn>
    </v-col>
  </v-row>

  <v-btn
    class="ma-2"
    variant="outlined"
    color="primary"
    :loading="playerEngagementStore.loading"
    @click="generateProposal"
    >Generate Proposal
  </v-btn>

  <v-alert v-if="message.text" :type="message.type" variant="tonal">{{ message.text }}</v-alert>

  <v-data-table
    :items-per-page="5"
    :items-per-page-options="[
      { value: 5, title: '5' },
      { value: 10, title: '10' },
      { value: 15, title: '15' }
    ]"
    :headers="engagementHeaders"
    :items="playerEngagements"
    :loading="playerEngagementStore.loading"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { usePlayerEngagementStore } from '@/stores/playerEngagement.store'
import {
  EngagementStatus,
  type PlayerEngagement,
  type PlayerEngagementWithPlayerInfo
} from '@/types/playerEngagement.type'
import { usePlayerStore } from '@/stores/player.store.ts'
import { Player } from 'squad-manager-server/src/models/Player.ts'

const props = defineProps<{
  contextType: 'player' | 'schedule'
  contextId: string
}>()

const allPlayers = ref<Player[]>([])
const autocompleteKey = ref(0)
const isPlayerAssignable = ref(false)
const message = ref({ text: '', type: 'error' as 'error' | 'success' | 'info' | 'warning' })
const playerEngagementStore = usePlayerEngagementStore()
const playerEngagements = ref<PlayerEngagementWithPlayerInfo[]>([])
const playerStore = usePlayerStore()
const selectedEngagement = ref<EngagementStatus>(EngagementStatus.DEFINITIVE)
const selectedPlayer = ref()

onMounted(async () => {
  await loadPlayerEngagements()
  await loadAllPlayers()
})

const engagementHeaders = [
  { title: 'Vorname', key: 'playerFirstname', sortable: true },
  { title: 'Name', key: 'playerName', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'manuell hinzugefügt', key: 'manually', sortable: true }
]

const loadPlayerEngagements = async () => {
  console.log(
    `context-id: ${props.contextId} - ${typeof props.contextId}, context-type: ${props.contextType}`
  )
  if (props.contextId !== '' && props.contextType === 'schedule') {
    await playerEngagementStore.loadPlayerEngagementsByScheduleId(props.contextId)
    playerEngagements.value = playerEngagementStore.formatEngagementsByPlayer()
    console.log(`Assigned players: ${JSON.stringify(playerEngagements.value)}`)
  }
}

const loadAllPlayers = async () => {
  await playerStore.loadPlayers()
  allPlayers.value = playerStore.players
}

const allPlayersWithFullName = computed(() =>
  allPlayers.value
    .map((player) => ({
      ...player,
      fullName: `${player.firstname} ${player.name}`
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
)

const onPlayerSelection = async (playerId: any) => {
  message.value.text = ''
  if (!playerId) {
    isPlayerAssignable.value = false
    return
  }

  try {
    isPlayerAssignable.value = await playerEngagementStore.isPlayerAssignable(
      playerId,
      props.contextId
    )
    if (!isPlayerAssignable.value) {
      message.value = {
        text: 'Player is already assigned.',
        type: 'error'
      }
    }
  } catch (error) {
    message.value = {
      text: error instanceof Error ? error.message : `An unexpected error occurred: ${error}`,
      type: 'error'
    }

    console.error(`Error occurred: ${message.value}`)
    selectedPlayer.value = undefined
    autocompleteKey.value++
  }
}

const assignPlayer = async (playerIdIn: string) => {
  try {
    console.log('Selected player: ', playerIdIn)
    const playerEngagementData: PlayerEngagement = {
      playerId: playerIdIn,
      scheduleId: props.contextId,
      status: selectedEngagement.value,
      manually: true
    }

    console.log('FOO', JSON.stringify(playerEngagementData))
    const result = await playerEngagementStore.assignNewPlayer(playerEngagementData)
    if (result.success) {
      message.value = {
        text: result.message,
        type: 'success'
      }
      setTimeout(() => {
        message.value.text = ''
      }, 2000)
      await loadPlayerEngagements()
    }
    console.log('FOOBAR')
  } catch (error) {
    console.log('ERROR')
    message.value = {
      text: error instanceof Error ? error.message : `An unexpected error occurred: ${error}`,
      type: 'error'
    }
  } finally {
    selectedPlayer.value = undefined
    autocompleteKey.value++
  }
}

const generateProposal = async () => {
  console.log('GENERATE PROPOSAL')
}
</script>
