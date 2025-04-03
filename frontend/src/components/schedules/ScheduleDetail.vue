<template>
  <v-dialog v-model="scheduleDetailDialog" persistent scrollable width="60%">
    <v-locale-provider>
      <v-card>
        <v-card-title class="headline">{{ isNew ? 'New Event' : 'Edit Event' }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-row>
              <v-col>
                <v-date-input
                  v-model="scheduledDate"
                  hide-actions
                  :first-day-of-week="1"
                  :label="t('schedule.date')"
                  :rules="[rules.required]"
                  required
                >
                </v-date-input>
              </v-col>
              <v-col>
                <v-select
                  v-model="detailSchedule.type"
                  :items="scheduleTypes"
                  :label="t('schedule.eventType')"
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="detailSchedule.matchType"
                  :items="matchTypes"
                  :disabled="detailSchedule.type === computedScheduleType.TRAINING"
                  :rules="
                    detailSchedule.type === computedScheduleType.MATCH_DAY ? [rules.required] : []
                  "
                  :label="t('schedule.matchType')"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
          <PlayerEngagementList
            :context-id="detailSchedule.scheduleId"
            :context-type="'schedule'"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="primary"
            :disabled="!isValid"
            flat
            @click="saveSchedule(false)"
            >Save
          </v-btn>
          <v-btn variant="text" color="secondary" @click="closeDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-locale-provider>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScheduleStore } from '@/stores/schedule.store'
import { MatchType, ScheduleType, type Schedule } from '@/types/schedule.type'
import PlayerEngagementList from '@/components/playerEngagements/PlayerEngagementList.vue'
import log from 'loglevel'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    scheduleDialog: boolean
    schedule: Schedule
    isNew: boolean
  }>(),
  {
    isNew: true
  }
)

const emit = defineEmits(['update:dialog', 'dialogClosed'])

const computedScheduleType = computed(() => ScheduleType)

const scheduleStore = useScheduleStore()
const scheduleDetailDialog = ref(props.scheduleDialog)
const detailSchedule = ref<Schedule>({ ...props.schedule })
const scheduledDate = ref<Date>()
const isValid = ref(false)
const rules = {
  required: (value: string) => !!value || t('common.messages.field_required')
}

const scheduleTypes = Object.values(ScheduleType)
const matchTypes = Object.values(MatchType)

const handleEsc = (event: KeyboardEvent) => {
  // check dropdown menu is open, if yes, just close dropdown
  const isMenuOpen = document.getElementsByClassName('v-menu').length !== 0

  if (event.key === 'Escape' && scheduleDetailDialog.value && !isMenuOpen) {
    closeDialog()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})

watch(
  () => props.scheduleDialog,
  (newVal) => {
    scheduleDetailDialog.value = newVal
    if (newVal) {
      // Initialize data set on opening dialog
      detailSchedule.value = { ...props.schedule }
      scheduledDate.value = detailSchedule.value.scheduleId
        ? new Date(detailSchedule.value.date)
        : undefined
      log.debug(`Open schedule dialog. initialise data ${detailSchedule.value}`)
    }
  }
)

watch(scheduledDate, (newDate) => {
  log.debug(`Date changed to ${newDate}`)
  if (newDate) {
    detailSchedule.value.date = newDate
  }
})

watch(scheduleDetailDialog, (newVal) => {
  emit('update:dialog', newVal)
})

watch(
  () => props.schedule,
  (schedule) => {
    detailSchedule.value = { ...schedule }
    log.debug(`New schedule ${detailSchedule.value}`)
  }
)

watch(
  () => detailSchedule.value.type,
  (newType) => {
    if (newType === ScheduleType.TRAINING) {
      detailSchedule.value.matchType = null
    }
  }
)

const closeDialog = () => {
  log.debug(`close dialog, ${detailSchedule.value?.date}`)
  emit('update:dialog', false)
  emit('dialogClosed', true)
  scheduleDetailDialog.value = false
}

const saveSchedule = async (closeAfterSave: boolean) => {
  if (props.isNew) {
    log.debug(`New event. Set date/time to ${detailSchedule.value.date.toISOString()}`)
    await scheduleStore.addSchedule(detailSchedule.value)
  } else {
    log.debug(`change existing event to ${detailSchedule.value}`)
    await scheduleStore.updateSchedule(detailSchedule.value)
  }
  if (closeAfterSave) {
    closeDialog()
  }
}
</script>
