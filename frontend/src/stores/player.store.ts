import { defineStore } from 'pinia'
import { addPlayer, getPlayers, readPlayer, updatePlayer } from '@/services/player.service'
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
    async readPlayer(playerId: string) {
      this.loading = true
      try {
        return await readPlayer(playerId)

        // Todo: Daten ab Player Store verwenden und bei Bedarf nachführen
        /* const existingPlayer = this.players.find(player => player.playerId === playerId)
           if (existingPlayer) {
             return existingPlayer // Wenn der Spieler bereits im Store ist, direkt zurückgeben
           }

           this.loading = true
           try {
             const fetchedPlayer = await readPlayer(playerId)
             this.players.push(fetchedPlayer) // Den abgerufenen Spieler im Store speichern
             this.totalPlayers++ return fetchedPlayer
           } catch (error) {
             console.error(error)
           } finally {
           this.loading = false
           }
        *
        * */

      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async addPlayer(newPlayer: Player) {
      const addedPlayer = await addPlayer(newPlayer)
      // Todo: auch Daten im Playerstore aktualisieren, damit read via Playerstore geamcht werden kann.
      // this.players.push(addedPlayer)
      // this.totalPlayers
      console.log("Store addedPlayer:", addedPlayer)
    },
    async updatePlayer(player: Player) {
      console.log("Store updatePlayer:", player)
      const updatedPlayer = await updatePlayer(player)
      // Todo: auch Daten im Playerstore aktualisieren, damit read via Playerstore geamcht werden kann.
      // const index = this.players.findIndex(p => p.playerId === player.playerId)
      // if (index !== -1) {
      //  this.players.splice(index, 1, updatedPlayer)
      // }
      console.log("Store updatedPlayer:", updatedPlayer)
    }
  }
})
