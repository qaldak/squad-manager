import { defineStore } from 'pinia'
import { getPlayerEngagementsByScheduleId } from '@/services/playerEngagement.service'
import { readPlayer } from '@/services/player.service'
import type { PlayerEngagement, PlayerEngagementWithPlayerInfo } from '@/types/playerEngagement.type'

export const usePlayerEngagementStore = defineStore('playerEngagement', {
  state: () => ({
    playerEngagements: [] as PlayerEngagement[],
    playerEngagementsWithPlayerInfo: [] as PlayerEngagementWithPlayerInfo[],
    loading: false,
    totalPlayerEngagements: 0,
    totalPlayerEngagementsWithPlayerInfo: 0
  }),
  actions: {
    async loadPlayerEngagementsByScheduleId(scheduleId: string) {
      this.loading = true
      try {
        console.log(`PlayerEngagement, scheduleId=${scheduleId}`)

        const fetchedPlayerEngagements = await getPlayerEngagementsByScheduleId(scheduleId)
        if (!Array.isArray(fetchedPlayerEngagements)) {
          throw new Error('fetchedPlayerEngagements is not an array')
        }
        
        console.log(`playerEngagement, fetchedPlayerEngagements: ${fetchedPlayerEngagements}`)
        this.playerEngagements = fetchedPlayerEngagements
        this.totalPlayerEngagements = fetchedPlayerEngagements.length

        const playerEngagementsWithPlayerInfo = await Promise.all(
          fetchedPlayerEngagements.map(async (playerEngagements) => {
            const playerInfo = await readPlayer(playerEngagements.playerId)
            return {
              ...playerEngagements,
              playerName: playerInfo.name,
              playerFirstname: playerInfo.firstname,
              playerPosition: playerInfo.position
            }
          })
        )
        this.playerEngagementsWithPlayerInfo = playerEngagementsWithPlayerInfo
        this.totalPlayerEngagementsWithPlayerInfo = playerEngagementsWithPlayerInfo.length

        console.log(`Check difference: ${this.totalPlayerEngagements} vs. ${this.totalPlayerEngagementsWithPlayerInfo}`)

        console.log(`extended Player Engagements: ${playerEngagementsWithPlayerInfo}`)
        return playerEngagementsWithPlayerInfo

      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    formatEngagementsByPlayer() {
      return this.playerEngagementsWithPlayerInfo.sort((a, b) => {
        // Mehrstufige Sortierung
        const statusOrder = { 'definitive': 0, 'provisional': 1, 'canceled': 2 }
        const statusComparison = statusOrder[a.status] - statusOrder[b.status]
        if (statusComparison !== 0)
          return statusComparison
        const nameComparison = a.playerName.localeCompare(b.playerName)
        if (nameComparison !== 0)
          return nameComparison
        return a.playerFirstname.localeCompare(b.playerFirstname)
      })
        .map((engagement) => ({
          ...engagement // Korrekte Verwendung des Spread-Operators
        }))
    }
  }
})


/*
import { defineStore } from 'pinia';
import { getPlayerEngagementsByScheduleId, getPlayerInfoById } from '@/services/playerEngagement.service';
import type { PlayerEngagement, PlayerInfo } from '@/types/playerEngagement.type';

export const usePlayerEngagementStore = defineStore('playerEngagement', {
  state: () => ({
    playerEngagements: [] as PlayerEngagement[],
    loading: false,
    totalPlayerEngagements: 0
  }),
  actions: {
    async loadPlayerEngagementsByScheduleId(scheduleId: string): Promise<PlayerEngagement[]> {
      this.loading = true;
      try {
        console.log(`PlayerEngagement, scheduleId=${scheduleId}`);

        const fetchedPlayerEngagements = await getPlayerEngagementsByScheduleId(scheduleId);
        const playerEngagementsWithInfo = await Promise.all(
          fetchedPlayerEngagements.map(async (engagement) => {
            const playerInfo = await getPlayerInfoById(engagement.playerId);
            return { ...engagement, playerName: playerInfo.name, playerPosition: playerInfo.position };
          })
        );

        console.log(`playerEngagement, fetchedPlayerEngagements: ${playerEngagementsWithInfo}`);
        this.playerEngagements = playerEngagementsWithInfo;
        this.totalPlayerEngagements = playerEngagementsWithInfo.length;

        return playerEngagementsWithInfo;
      } catch (e) {
        console.error(e);
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
});

*
* */