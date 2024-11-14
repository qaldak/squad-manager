<template>
  <v-list>
    <v-list-subheader>Spielerzuweisungen</v-list-subheader>
    <v-list-item v-if="playerEngagements.length === 0">
      <v-list-item-title>Keine Spielerzuweisungen vorhanden
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-for="(engagement, index) in playerEngagements" :key="index">
      <v-list-item-title>
        {{ engagement.playerName }}, {{ engagement.playerFirstname }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ engagement.status }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="engagement.manually">Manuell zugewiesen
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePlayerEngagementStore } from '@/stores/playerEngagement.store'
import { type PlayerEngagementWithPlayerInfo } from '@/types/playerEngagement.type'

const props = defineProps<{
  contextType: 'player' | 'schedule';
  contextId: string;
}>()

const playerEngagementStore = usePlayerEngagementStore()
const playerEngagements = ref<PlayerEngagementWithPlayerInfo[]>([])

const loadPlayerEngagements = async () => {
  console.log(`context-id: ${props.contextId} - ${typeof props.contextId}, context-type: ${props.contextType}`)
  if (props.contextId !== '' && props.contextType === 'schedule') {
    await playerEngagementStore.loadPlayerEngagementsByScheduleId(props.contextId)
    playerEngagements.value = playerEngagementStore.formatEngagementsByPlayer()
  }
}

onMounted(() => {
  loadPlayerEngagements()
})

</script>
