<template>
  <v-dialog v-model="scheduleDetailDialog" persistent max-width="290">
    <v-locale-provider>
      <v-card>
        <v-card-title class="headline">{{
            isNew ? 'Neuer Termin' : 'Termin bearbeiten'
          }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-date-input
              v-model="formattedDate"
              :first-day-of-week="1"
              label="Datum"
              :rules="[rules.required]"
              required>
            </v-date-input>
            <v-select v-model="detailSchedule.type" :items="scheduleTypes" label="Terminart" :rules="[rules.required]" required></v-select>
            <v-select v-model="detailSchedule.matchType" :items="matchTypes" label="Matchtyp"></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="closeDialog()">Disagree</v-btn>
          <v-btn color="primary" flat @click="closeDialog()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-locale-provider>

  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store'
import { MatchType, ScheduleType, type Schedule } from '@/types/schedule.type'
import { format } from 'date-fns'

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
    const detailSchedule = ref<Schedule> ({ ...props.schedule })
    const isValid = ref(false)
    const rules = {
      required: (value: string) => !!value || 'This field is required'
    }

    const formattedDate = ref('')

    const scheduleTypes = Object.values(ScheduleType)
    const matchTypes = Object.values(MatchType)

    // Initialisierung mit aktuellen Daten oder leeren Werten
    if (props.schedule.date) {
      formattedDate.value = format(new Date(props.schedule.date), 'yyyy-MM-dd')
      console.log('Initiales Datum aus props:', formattedDate.value)
    } else {
      formattedDate.value = format(new Date(), 'yyyy-MM-dd')
      console.log('Neues initiales Datum:', formattedDate.value)
    }

    watch(
      () => detailSchedule.value.date,
      (newDate) => {
        if (newDate) {
          formattedDate.value = format(new Date(newDate), 'yyyy-MM-dd')
          console.log('Watcher - neues Datum gesetzt:', formattedDate.value)
        } else {
          formattedDate.value = format(new Date(), 'yyyy-MM-dd')
          console.log('Watcher - neues initiales Datum gesetzt:', formattedDate.value)
        }
      },
      { immediate: true }
    )

    watch(
      () => props.scheduleDialog,
      (newVal) => {
        scheduleDetailDialog.value = newVal;
        if (newVal) {
          formattedDate.value = format(new Date(detailSchedule.value.date), 'yyyy-MM-dd')
        }
      }
    )

    watch(scheduleDetailDialog, (newVal) => {
      emit('update:dialog', newVal)
    })

    watch(() => props.schedule, (newSchedule) => {
      detailSchedule.value = { ...newSchedule }
    })

    const closeDialog = () => {
      console.log(detailSchedule.value.date)
      emit('update:dialog', false)
      emit('dialogClosed', true)
      scheduleDetailDialog.value = false
    }

    const saveSchedule = async (closeAfterSave: boolean) => {
      if (props.isNew) {
        console.log('Foo')
        // TODO: addSchedule
      } else {
        console.log('Bar')
        // TODO: updateSchedule
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
      formattedDate
    }
  }
})
</script>
