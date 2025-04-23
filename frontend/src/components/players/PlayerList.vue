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

    <v-data-table-virtual
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
          <td>{{ item.birthYear }}</td>
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
import { type Player } from '@/types/player.type'
import PlayerDetail from '@/components/players/PlayerDetail.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const playerStore = usePlayerStore()
const players = ref<Player[]>([])
const dialog = ref(false)
const isNew = ref(true)
const newPlayer = ref<Player>({
  playerId: '',
  name: '',
  firstname: '',
  birthYear: undefined,
  position: undefined
})

const formatPlayers = () => {
  return playerStore.players
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((player) => ({
      playerId: player.playerId,
      name: player.name,
      firstname: player.firstname,
      position: player.position,
      birthYear: player.birthYear
    }))
}

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

const reloadPlayers = async () => {
  await playerStore.loadPlayers()
  players.value = formatPlayers()
}

onMounted(() => {
  playerStore.loadPlayers()
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
  { title: '', key: 'edit', sortable: false }
]
</script>
