import { defineStore } from 'pinia'
import { getPlayers, addPlayer, updatePlayer } from '@/services/player.service'
import type { Player } from '@/types/player.type'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: [] as Player[],
    loading: false,
    totalPlayers: 0
  }),
  actions: {
    async loadPlayers() {
      this.loading = true
      try {
        const fetchedPlayers = await getPlayers()
        this.players = fetchedPlayers
        this.totalPlayers = fetchedPlayers.length
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async addPlayer(newPlayer: Player) {
      const addedPlayer = await addPlayer(newPlayer)
      console.log(addedPlayer)
    },
    async updatePlayer(player: Player) {
      const updatedPlayer = await updatePlayer(player)
      console.log(updatedPlayer)
    }
  }
})
