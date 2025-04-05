<!-- ScheduleList.vue -->
<template>
  <header>{{ t('schedule.schedules') }}</header>
  <v-btn class="text-none" @click="openScheduleDialog(true)"
    >{{ t('schedule.buttons.newSchedule') }}
  </v-btn>
  <v-chip-group>
    <v-chip
      color="white"
      filter
      :text="t('schedule.buttons.inclPastFilter')"
      variant="outlined"
      @click="togglePastFilter"
    ></v-chip>
  </v-chip-group>
  <v-data-table
    :headers="headers"
    :items="filteredSchedules"
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
        <td>{{ t(`schedule.enums.scheduleType.${item.type}`) }}</td>
        <td>{{ item.matchType ? t(`schedule.enums.matchType.${item.matchType}`) : '' }}</td>
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScheduleStore } from '@/stores/schedule.store'
import { ScheduleType, type Schedule } from '@/types/schedule.type'
import ScheduleDetail from '@/components/schedules/ScheduleDetail.vue'
import { formatDate, startOfDay } from 'date-fns'
import log from 'loglevel'

const { t } = useI18n()
const isNew = ref(true)
const pastFilterActive = ref(false)
const schedules = ref<Schedule[]>([])
const scheduleDialog = ref(false)
const scheduleStore = useScheduleStore()
const actualSchedule = ref<Schedule>({
  scheduleId: '',
  date: new Date(),
  type: ScheduleType.TRAINING,
  matchType: undefined
})

const filteredSchedules = computed(() => {
  if (pastFilterActive.value) {
    return schedules.value
  }
  const today = startOfDay(new Date())
  return schedules.value.filter((schedule) => new Date(schedule.date) >= today)
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
  log.debug(`openScheduleDialog with schedule: ${schedule}`)
  log.debug(`openScheduleDialog is new? ${createNew}`)

  isNew.value = createNew
  if (createNew) {
    actualSchedule.value = {
      scheduleId: '',
      date: new Date(),
      type: ScheduleType.GAME_DAY,
      matchType: undefined
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

const togglePastFilter = () => {
  pastFilterActive.value = !pastFilterActive.value
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
  { title: t('schedule.date'), key: 'date', sortable: true },
  { title: t('schedule.scheduleType'), key: 'type', sortable: true },
  { title: t('schedule.matchType'), key: 'matchType' }
]
</script>
