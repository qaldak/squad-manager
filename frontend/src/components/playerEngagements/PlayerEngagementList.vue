<template>
  <v-card-title>Player engagement</v-card-title>
  <v-row>
    <v-col cols="9">
      <v-autocomplete
        v-model="selectedPlayer"
        :items="allPlayersWithFullName"
        item-title="fullName"
        item-value="playerId"
        label="assign player"
        placeholder="enter name or first name"
        clearable
        :key="autocompleteKey"
        @update:modelValue="onPlayerSelection"
      ></v-autocomplete>
    </v-col>
    <v-col cols="3" class="d-flex align-center">
      <v-btn
        :disabled="!isPlayerAssignable"
        :loading="playerEngagementStore.loading"
        @click="assignPlayer"
        >Assign
      </v-btn>
    </v-col>
  </v-row>

  <v-data-table
    :headers="engagementHeaders"
    :items="playerEngagements"
    :loading="playerEngagementStore.loading"
  />
  <v-alert v-if="errorMessage" closable type="error" variant="tonal">{{ errorMessage }}</v-alert>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePlayerEngagementStore } from '@/stores/playerEngagement.store'
import {
  EngagementStatus,
  type PlayerEngagement,
  type PlayerEngagementWithPlayerInfo
} from '@/types/playerEngagement.type'
import { usePlayerStore } from '@/stores/player.store.ts'

const props = defineProps<{
  contextType: 'player' | 'schedule'
  contextId: string
}>()

const playerEngagementStore = usePlayerEngagementStore()
const playerEngagements = ref<PlayerEngagementWithPlayerInfo[]>([])
const playerStore = usePlayerStore()
const selectedPlayer = ref(null)
const allPlayers = ref([])
const autocompleteKey = ref(0)
const errorMessage = ref('')
const isPlayerAssignable = ref(false)

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

const assignPlayer = async () => {
  try {
    console.log('Selected player: ', selectedPlayer.value)
    const playerEngagementData: PlayerEngagement = {
      playerId: selectedPlayer.value,
      scheduleId: props.contextId,
      status: EngagementStatus.DEFINITIVE,
      manually: true
    }

    console.log('FOO', JSON.stringify(playerEngagementData))
    await playerEngagementStore.assignNewPlayer(playerEngagementData)
    console.log('FOOBAR')
  } catch (error) {
    console.log('ERROR')
    errorMessage.value = error.message
  } finally {
    selectedPlayer.value = null
    autocompleteKey.value++
  }
}

const onPlayerSelection = async (playerId: string) => {
  errorMessage.value = undefined
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
      errorMessage.value = 'Player is already assigned.'
    }
  } catch (e) {
    console.error(`Error occurred: ${e.message}`)
    errorMessage.value = e.message
    selectedPlayer.value = undefined
    autocompleteKey.value++
  }
}

onMounted(async () => {
  await loadPlayerEngagements()
  await loadAllPlayers()
})

const engagementHeaders = [
  { title: 'Name', key: 'playerName', sortable: true },
  { title: 'Vorname', key: 'playerFirstname', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Manuell hinzugefügt', key: 'manually', sortable: true }
]

const loadAllPlayers = async () => {
  await playerStore.loadPlayers()
  allPlayers.value = playerStore.players
}

const allPlayersWithFullName = computed(() =>
  allPlayers.value.map((player) => ({
    ...player,
    fullName: `${player.firstname} ${player.name}`
  }))
)
</script>
