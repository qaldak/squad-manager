<!-- PlayerList.vue -->
<template>
  <div class="list-container">
    <v-row align="center">
      <header class="text-h4 pa-2 ma-2">{{ t('player.players') }}</header>
      <v-spacer />
      <v-btn class="normal-btn" color="primary" variant="outlined" @click="openDialog(true)">
        {{ t('player.buttons.newPlayer') }}
      </v-btn>
    </v-row>

    <v-text-field
      v-model="search"
      density="compact"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      clearable
      flat
      hide-details
      single-line
    >
    </v-text-field>
    <v-data-table-virtual
      v-model:search="search"
      :filter-keys="['firstname', 'name', 'birthYear']"
      :headers="headers"
      :items="players"
      :loading="playerStore.loading"
      :server-items-length="playerStore.totalPlayers"
      scrollable
      height="75vh"
      fixed-header
    >
      <template v-slot:item="{ item }">
        <tr @dblclick="openDialog(false, item)">
          <td>{{ item.firstname }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.position ? t(`player.enums.position.${item.position}`) : '' }}</td>
          <td class="text-center">{{ item.birthYear }}</td>
          <td class="text-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  {{ item.totalParticipation }}
                </span>
              </template>
              <span
                v-for="matchTypeSummary in engagementSummaries[item.playerId]?.matchTypeSummaries"
                :key="matchTypeSummary.matchType"
              >
                {{ t(`schedule.enums.matchType.${matchTypeSummary.matchType}`) }}:
                {{ matchTypeSummary.totalParticipation }}
                {{ t(`playerEngagement.totalParticipation`) }},
                {{ matchTypeSummary.totalCancellation }}
                {{ t(`playerEngagement.totalCancellation`) }}
                <br />
              </span>
            </v-tooltip>
          </td>
          <td class="text-center">{{ item.totalCancellation }}</td>
          <td>
            <v-btn small @click.stop="openDialog(false, item)">
              <font-awesome-icon icon="fa-solid fa-pencil" />
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <PlayerDetail
      v-model:dialog="dialog"
      :player="newPlayer"
      :isNew="isNew"
      @update:dialog="updateDialog"
      @dialogClosed="reloadPlayers"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePlayerStore } from '@/stores/player.store'
import { type Player, type PlayerWithEngagement } from '@/types/player.type'
import PlayerDetail from '@/components/players/PlayerDetail.vue'
import { useI18n } from 'vue-i18n'
import log from 'loglevel'
import type { PlayerEngagementSummary } from '@/types/playerEngagement.type.ts'
import { getPlayerEngagementSummary } from '@/services/playerEngagement.service.ts'
import { MatchType } from '@/types/schedule.type.ts'

const { t } = useI18n()
const playerStore = usePlayerStore()
const players = ref<PlayerWithEngagement[]>([])
const dialog = ref(false)
const isNew = ref(true)
const newPlayer = ref<Player>({
  playerId: '',
  name: '',
  firstname: '',
  birthYear: undefined,
  position: undefined
})
const search = ref('')

const engagementSummaries = ref<{ [key: string]: PlayerEngagementSummary }>({})

const openDialog = (createNew: boolean, player?: Player) => {
  isNew.value = createNew
  if (createNew) {
    newPlayer.value = {
      playerId: '',
      name: '',
      firstname: '',
      birthYear: undefined,
      position: undefined
    }
  } else if (player) {
    newPlayer.value = { ...player }
  }
  dialog.value = true
}

const updateDialog = (value: boolean) => {
  dialog.value = value
}

const formatPlayers = (): PlayerWithEngagement[] => {
  return playerStore.players
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((player) => ({
      ...player,
      totalParticipation: (engagementSummaries.value as { [key: string]: PlayerEngagementSummary })[
        player.playerId
      ]?.totalParticipation,
      totalCancellation: (engagementSummaries.value as { [key: string]: PlayerEngagementSummary })[
        player.playerId
      ]?.totalCancellation
    }))
}

const reloadPlayers = async () => {
  await playerStore.loadPlayers()
  await Promise.all(playerStore.players.map((player) => getEngagementSummary(player.playerId)))
  players.value = formatPlayers()
}

const getEngagementSummary = async (playerId: string) => {
  try {
    const summary = await getPlayerEngagementSummary(playerId)
    console.log(summary)
    if (summary) {
      const matchTypeOrder = [MatchType.LEAGUE, MatchType.CUP, MatchType.INDOOR, MatchType.FRIENDLY]

      engagementSummaries.value[playerId as keyof typeof engagementSummaries.value] = {
        totalParticipation: summary.totalParticipation,
        totalCancellation: summary.totalCancellation,
        matchTypeSummaries: summary.matchTypeSummaries
          .map((matchTypeSummary) => ({
            matchType: matchTypeSummary.matchType,
            totalParticipation: matchTypeSummary.totalParticipation,
            totalCancellation: matchTypeSummary.totalCancellation
          }))
          .sort((a, b) => {
            return matchTypeOrder.indexOf(a.matchType) - matchTypeOrder.indexOf(b.matchType)
          })
      }
    }
  } catch (error) {
    log.error('Error fetching engagement summary: ', error.message)
    engagementSummaries.value[playerId as keyof typeof engagementSummaries.value] = {
      totalParticipation: -99,
      totalCancellation: -99,
      matchTypeSummaries: []
    }
  }
}

onMounted(() => {
  reloadPlayers()
  // playerStore.loadPlayers()
  playerStore.$subscribe((mutation, state) => {
    if (!state.loading) {
      players.value = formatPlayers()
    }
  })
})

const headers = [
  { title: t('player.firstname'), key: 'firstname', sortable: true },
  { title: t('player.name'), key: 'name', sortable: true },
  { title: t('player.position'), key: 'position' },
  { title: t('player.yearOfBirth'), key: 'birthYear' },
  { title: t('playerEngagement.totalParticipation'), key: 'totalParticipation', sortable: true },
  { title: t('playerEngagement.totalCancellation'), key: 'totalCancellation', sortable: true },
  { title: '', key: 'edit', sortable: false }
]
</script>
