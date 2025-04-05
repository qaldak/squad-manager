<template>
  <v-card-title>{{ t('playerEngagement.titles.playerEngagement') }}</v-card-title>
  <v-row>
    <v-col>
      <v-autocomplete
        :key="autocompleteKey"
        v-model="selectedPlayer"
        :items="allPlayersWithFullName"
        clearable
        item-title="fullName"
        item-value="playerId"
        :label="t('playerEngagement.assignPlayer')"
        :placeholder="t('playerEngagement.messages.searchPlayer')"
        @update:modelValue="onPlayerSelection"
      ></v-autocomplete>
    </v-col>
    <v-col class="justify-center">
      <v-radio-group v-model="selectedEngagement" inline>
        <v-radio
          :label="t('playerEngagement.enums.status.DEFINITIVE')"
          :value="EngagementStatus.DEFINITIVE"
        />
        <v-radio
          :label="t('playerEngagement.enums.status.CANCELED')"
          :value="EngagementStatus.CANCELED"
        />
      </v-radio-group>
    </v-col>
    <v-col class="justify-center">
      <v-btn
        variant="outlined"
        :disabled="!isPlayerAssignable"
        :loading="playerEngagementStore.loading"
        @click="assignPlayer(selectedPlayer)"
        >{{ t('playerEngagement.buttons.assignPlayer') }}
      </v-btn>
    </v-col>
  </v-row>

  <v-btn
    class="ma-2"
    variant="outlined"
    color="primary"
    :loading="playerEngagementStore.loading"
    @click="generateProposal"
    >{{ t('playerEngagement.buttons.generateProposal') }}
  </v-btn>

  <v-btn
    class="ma-2"
    variant="outlined"
    color="primary"
    :loading="playerEngagementStore.loading"
    @click="confirmProposal"
    >{{ t('playerEngagement.buttons.confirmProposal') }}
  </v-btn>

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
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.playerFirstname }}</td>
        <td>{{ item.playerName }}</td>
        <td>{{ t(`playerEngagement.enums.status.${item.status.toUpperCase()}`) }}</td>
        <td>{{ t(`common.bool.${item.manually}`) }}</td>
        <td>
          <v-btn small @click="deleteEngagement(item)">
            <font-awesome-icon icon="fa-solid fa-trash" />
            <v-tooltip activator="parent"
              >{{ t('playerEngagement.messages.deletePlayer') }}
            </v-tooltip>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-alert v-if="message.text" :type="message.type" variant="tonal">{{ message.text }}</v-alert>
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
import log from 'loglevel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  { title: t('player.firstname'), key: 'playerFirstname', sortable: true },
  { title: t('player.name'), key: 'playerName', sortable: true },
  { title: t('playerEngagement.status'), key: 'status', sortable: true },
  { title: t('playerEngagement.manuallyAdded'), key: 'manually', sortable: true },
  { title: '', key: 'deleteBtn', sortable: false }
]

const loadPlayerEngagements = async () => {
  log.debug(
    `context-id: ${props.contextId} - ${typeof props.contextId}, context-type: ${props.contextType}`
  )
  if (props.contextId !== '' && props.contextType === 'schedule') {
    await playerEngagementStore.loadPlayerEngagementsByScheduleId(props.contextId)
    playerEngagements.value = playerEngagementStore.formatEngagementsByPlayer
    log.debug(`Assigned players: ${JSON.stringify(playerEngagements.value)}`)
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
    isPlayerAssignable.value = playerEngagementStore.isPlayerAssignable(playerId, props.contextId)
    if (!isPlayerAssignable.value) {
      message.value = {
        text: t('playerEngagement.messages.playerAlreadyAssigned'),
        type: 'error'
      }
    }
  } catch (error) {
    message.value = {
      text: error instanceof Error ? error.message : `An unexpected error occurred: ${error}`,
      type: 'error'
    }

    log.error(`Error occurred: ${message.value}`)
    selectedPlayer.value = undefined
    autocompleteKey.value++
  }
}

const assignPlayer = async (playerIdIn: string) => {
  try {
    log.debug(`selected Player to assign: ${playerIdIn}`)
    const playerEngagementData: PlayerEngagement = {
      id: '',
      playerId: playerIdIn,
      scheduleId: props.contextId,
      status: selectedEngagement.value,
      manually: true
    }

    log.debug(`assign Player: ${JSON.stringify(playerEngagementData)}`)
    const result = await playerEngagementStore.assignNewPlayer(playerEngagementData)
    if (result.success) {
      message.value = {
        text: t('playerEngagement.messages.playerAssigned'),
        type: 'success'
      }
      setTimeout(() => {
        message.value.text = ''
      }, 2000)
      await loadPlayerEngagements()
    }
  } catch (error) {
    log.error(`Assign player: unexpected error occured. ${error.message ? error.message : error}`)
    message.value = {
      text: error instanceof Error ? error.message : `An unexpected error occurred: ${error}`,
      type: 'error'
    }
  } finally {
    selectedPlayer.value = undefined
    autocompleteKey.value++
  }
}

const deleteEngagement = async (engagement: PlayerEngagementWithPlayerInfo) => {
  log.debug(`Delete player engagement: ${JSON.stringify(engagement)}`)
  const result = await playerEngagementStore.deletePlayerEngagement(engagement)
  log.debug(`Response delete api: ${JSON.stringify(result)}`)
  if (result.success) {
    message.value = {
      text: t('playerEngagement.messages.playerDeleted'),
      type: 'success'
    }
    setTimeout(() => {
      message.value.text = ''
    }, 2000)
    await loadPlayerEngagements()
  }
}

const generateProposal = async () => {
  log.info(`Starting generate proposal ...`)
  await playerEngagementStore.generateProposal(props.contextId)
  await loadPlayerEngagements()
  log.debug(`Proposal generated`)
}

const confirmProposal = async () => {
  log.info(`Confirm proposal.`)
  await playerEngagementStore.confirmProposal(props.contextId)
  await loadPlayerEngagements()
}
</script>
