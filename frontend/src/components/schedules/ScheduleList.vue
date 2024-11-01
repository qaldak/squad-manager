<!-- PlayerList.vue -->
<template>
  <header>Termine</header>
  <v-data-table
    :headers="headers"
    :items="schedules"
    :loading="loading"
    :server-items-length="totalSchedules"
    :items-per-page="10"
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 25, title: '25' },
      { value: 50, title: '50' }
    ]"
  >
    <template #item="{ item }">
      <tr>
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.matchType }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store';
import { type Schedule } from '@/types/schedule.type'

export default {
  setup() {
    const scheduleStore = useScheduleStore()

    const schedules = ref<Schedule[]>([])

    const formatSchedules = () => {
      return scheduleStore.schedules
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateA - dateB
        })
        .map((schedule) => ({
          scheduleId: schedule.scheduleId,
          date: schedule.date,
          type: schedule.type,
          matchType: schedule.matchType
        }))
    }

    onMounted(() => {
      scheduleStore.loadSchedules()
      scheduleStore.$subscribe((mutation, state) => {
        if (!state.loading) {
          schedules.value = formatSchedules()
        }
      })
    })

    return {
      headers: [
        { title: 'Datum', key: 'date', sortable: true },
        { title: 'Terminart', key: 'type', sortable: true },
        { title: 'Matchtyp', key: 'matchType' }
      ],
      schedules: schedules,
      loading: scheduleStore.loading,
      totalSchedules: scheduleStore.totalSchedules
    }
  }
}
</script>
