import { defineStore } from 'pinia'
import { addPlayer, getPlayers, readPlayer, updatePlayer } from '@/services/player.service'
import type { Player } from '@/types/player.type'
import log from 'loglevel'

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
        log.error(error)
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
             log.error(error)
           } finally {
           this.loading = false
           }
        *
        * */
      } catch (error) {
        logger.error(error)
      } finally {
        this.loading = false
      }
    },
    async addPlayer(newPlayer: Player) {
      const addedPlayer = await addPlayer(newPlayer)
      // Todo: update data in Playerstore, for reading data from Playerstore.
      // this.players.push(addedPlayer)
      // this.totalPlayers
      log.debug(`store addedPlayer: ${addedPlayer}`)
    },
    async updatePlayer(player: Player) {
      log.debug(`Store updated player: ${player}`)
      const updatedPlayer = await updatePlayer(player)
      // Todo: update data in Playerstore, for reading data from Playerstore.
      // const index = this.players.findIndex(p => p.playerId === player.playerId)
      // if (index !== -1) {
      //  this.players.splice(index, 1, updatedPlayer)
      // }
      log.debug(`store updatedPlayer: ${updatedPlayer}`)
    }
  }
})
