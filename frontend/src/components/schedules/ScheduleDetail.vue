<template>
  <v-dialog v-model="scheduleDetailDialog" persistent max-width="290">
    <v-locale-provider>
      <v-card>
        <v-card-title class="headline">{{
            isNew ? 'Neuer Termin' : 'Termin bearbeiten'
          }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-date-input
              v-model="scheduledDate"
              :first-day-of-week="1"
              label="Datum"
              :rules="[rules.required]"
              required
            >
            </v-date-input>
            <v-select
              v-model="detailSchedule.type"
              :items="scheduleTypes"
              label="Terminart"
              :rules="[rules.required]"
              required
            ></v-select>
            <v-select
              v-model="detailSchedule.matchType"
              :items="matchTypes"
              label="Matchtyp"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="closeDialog()">Disagree</v-btn>
          <v-btn color="primary" flat @click="saveSchedule(true)">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-locale-provider>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store'
import { MatchType, ScheduleType, type Schedule } from '@/types/schedule.type'

export default defineComponent({
  props: {
    scheduleDialog: {
      type: Boolean,
      required: true
    },
    schedule: {
      type: Object as () => Schedule,
      required: true
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:dialog', 'dialogClosed'],
  setup(props, { emit }) {
    const scheduleStore = useScheduleStore()
    const scheduleDetailDialog = ref(props.scheduleDialog)
    const detailSchedule = ref<Schedule>({ ...props.schedule })
    const scheduledDate = ref<Date>()
    const isValid = ref(false)
    const rules = {
      required: (value: string) => !!value || 'This field is required'
    }

    const scheduleTypes = Object.values(ScheduleType)
    const matchTypes = Object.values(MatchType)

    watch(
      () => props.scheduleDialog,
      (newVal) => {
        scheduleDetailDialog.value = newVal
        if (newVal) {
          // Initialisiere die Daten erst, wenn der Dialog geöffnet wird
          detailSchedule.value = { ...props.schedule }
          console.log('Check', detailSchedule.value)
          scheduledDate.value = detailSchedule.value.scheduleId ? new Date(detailSchedule.value.date) : undefined
          console.log('Dialog geöffnet - initialisierte Daten:', detailSchedule.value)
          console.log('Dialog geöffnet - initialisierte Daten 2 :', detailSchedule.value.date)
        }
      }
    )

    watch(scheduledDate, (newDate) => {
      console.log('Datum geändert:', newDate)
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
        // scheduledDate.value = new Date(schedule.date)
        console.log('Neuer Termin', scheduledDate.value)
        console.log('Neuer Termin', detailSchedule.value)
      }
    )

    const closeDialog = () => {
      console.log('what', detailSchedule.value?.date)
      emit('update:dialog', false)
      emit('dialogClosed', true)
      scheduleDetailDialog.value = false
    }

    const saveSchedule = async (closeAfterSave: boolean) => {
      if (props.isNew) {
        console.log('Foo')
        console.log(detailSchedule.value)
        await scheduleStore.addSchedule(detailSchedule.value)
      } else {
        console.log('Bar')
        console.log(detailSchedule.value)
        await scheduleStore.updateSchedule(detailSchedule.value)
      }
      if (closeAfterSave) {
        closeDialog()
      }
    }

    return {
      isValid,
      rules,
      scheduleTypes,
      matchTypes,
      closeDialog,
      saveSchedule,
      scheduleDetailDialog: scheduleDetailDialog,
      detailSchedule: detailSchedule,
      scheduledDate
    }
  }
})
</script>
