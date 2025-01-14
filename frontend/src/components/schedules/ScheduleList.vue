<!-- ScheduleList.vue -->
<template>
  <header>Termine</header>
  <v-btn class="text-none" @click="openScheduleDialog(true)">Neuer Termin</v-btn>
  <v-data-table
    :headers="headers"
    :items="schedules"
    :loading="scheduleStore.loading"
    :server-items-length="scheduleStore.totalSchedules"
    :items-per-page="10"
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 25, title: '25' },
      { value: 50, title: '50' }
    ]"
  >
    <template v-slot:item="{ item }">
      <tr @dblclick="openScheduleDialog(false, item)">
        <td>{{ formatDate(item.date, 'dd.MM.yyyy') }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.matchType }}</td>
      </tr>
    </template>
  </v-data-table>

  <ScheduleDetail
    v-model:scheduleDialog="scheduleDialog"
    :schedule="actualSchedule"
    :isNew="isNew"
    @update:dialog="updateDialog"
    @dialogClosed="reloadSchedules"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store'
import { ScheduleType, type Schedule } from '@/types/schedule.type'
import ScheduleDetail from '@/components/schedules/ScheduleDetail.vue'
import { formatDate } from 'date-fns'

const isNew = ref(true)
const schedules = ref<Schedule[]>([])
const scheduleDialog = ref(false)
const scheduleStore = useScheduleStore()
const actualSchedule = ref<Schedule>({
  id: '',
  date: new Date(),
  type: ScheduleType.TRAINING,
  matchtype: undefined
})

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

const openScheduleDialog = (createNew: boolean, schedule?: Schedule) => {
  console.log('FOOBAR:', schedule)
  console.log('Barfoo: ', createNew, isNew.value)

  isNew.value = createNew
  if (createNew) {
    actualSchedule.value = {
      id: '',
      date: new Date(),
      type: ScheduleType.MATCH_DAY,
      matchtype: undefined
    }
    scheduleDialog.value = true
  } else if (schedule) {
    actualSchedule.value = { ...schedule }
  }
  scheduleDialog.value = true
}

const reloadSchedules = async () => {
  await scheduleStore.loadSchedules()
  schedules.value = formatSchedules()
}

const updateDialog = (value: boolean) => {
  scheduleDialog.value = value
}

onMounted(() => {
  scheduleStore.loadSchedules()
  scheduleStore.$subscribe((mutation, state) => {
    if (!state.loading) {
      schedules.value = formatSchedules()
    }
  })
})

const headers = [
  { title: 'Datum', key: 'date', sortable: true },
  { title: 'Terminart', key: 'type', sortable: true },
  { title: 'Matchtyp', key: 'matchType' }
]
</script>
