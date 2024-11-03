<!-- PlayerList.vue -->
<template>
  <header>Spieler</header>
  <v-btn @click="openDialog(true)">Neuer Spieler</v-btn>
  <v-data-table
    :headers="headers"
    :items="players"
    :loading="loading"
    :server-items-length="totalPlayers"
    :items-per-page="10"
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 25, title: '25' },
      { value: 50, title: '50' }
    ]"
  >
    <template v-slot:item="{ item }">
      <tr @dblclick="openDialog(false, item)">
        <td>{{ item.firstname }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.position }}</td>
        <td>
          <v-btn small @click.stop="openDialog(false, item)">
            <font-awesome-icon icon="fa-solid fa-pencil" />
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <PlayerDetail
    v-model:dialog="dialog"
    :player="newPlayer"
    :isNew="isNew"
    @update:dialog="updateDialog"
    @dialogClosed="reloadPlayers"
  />
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { usePlayerStore } from '@/stores/player.store'
import { type Player } from '@/types/player.type'
import PlayerDetail from '@/components/players/PlayerDetail.vue'

export default {
  components: {
    PlayerDetail
  },
  setup() {
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
          position: player.position
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

    return {
      headers: [
        { title: 'Vorname', key: 'firstname', sortable: true },
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Position', key: 'position' }
      ],
      players,
      loading: playerStore.loading,
      totalPlayers: playerStore.totalPlayers,
      dialog,
      openDialog,
      updateDialog,
      reloadPlayers,
      newPlayer,
      isNew
    }
  }
}
</script>
