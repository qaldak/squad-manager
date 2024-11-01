<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-btn data-test="getPlayersButton" @click="playersApi">Get Players</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getPlayers } from '../services/player.service'
import type { Player } from '@/types/player.type'

export default defineComponent({
  setup() {
    const players = ref<Player[]>([]) // Typisiere das players-Array

    const playersApi = async () => {
      try {
        const fetchedPlayers = await getPlayers()
        players.value = fetchedPlayers
        console.log(players)
      } catch (error) {
        console.error(error)
      }
    }
    return { players, playersApi }
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
