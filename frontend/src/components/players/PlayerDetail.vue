<template>
  <v-dialog v-model="detailDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h5 pa-2 ma-2">
        {{ isNew ? t('player.titles.newPlayer') : t('player.titles.editPlayer') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="detailPlayer.firstname"
            :label="t('player.firstname')"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="detailPlayer.name"
            :label="t('player.name')"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            clearable
            v-model.number="detailPlayer.birthYear"
            :label="t('player.yearOfBirth')"
            :rules="[rules.birthYear]"
          ></v-text-field>
          <v-select
            clearable
            v-model="detailPlayer.position"
            :items="positions"
            item-title="label"
            item-value="value"
            :label="t('player.position')"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="outlined" :disabled="!valid" @click="savePlayer(false)"
          >{{ t('common.buttons.save') }}
        </v-btn>
        <v-btn
          class="normal-btn"
          color="primary"
          variant="outlined"
          :disabled="!valid"
          @click="savePlayer(true)"
          >{{ t('common.buttons.saveAndClose') }}
        </v-btn>
        <v-btn class="normal-btn" color="secondary" @click="closeDialog">{{
          t('common.buttons.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Position, type Player } from '@/types/player.type'
import { usePlayerStore } from '@/stores/player.store'
import log from 'loglevel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    dialog: boolean
    player: Player
    isNew?: boolean
  }>(),
  {
    isNew: true
  }
)

const emit = defineEmits(['update:dialog', 'dialogClosed'])

const playerStore = usePlayerStore()
const detailDialog = ref(props.dialog)
const detailPlayer = ref({ ...props.player })
const valid = ref(false)
const rules = {
  required: (value: string) => !!value || 'This field is required',
  birthYear: (value: number) =>
    (value > 1930 && value <= new Date().getFullYear()) || value === null || 'Value not allowd'
}

const positions = Object.values(Position).map((position) => ({
  value: position,
  label: t(`player.enums.position.${position}`)
}))

watch(
  () => props.dialog,
  (newVal) => {
    detailDialog.value = newVal
  }
)

watch(detailDialog, (newVal) => {
  emit('update:dialog', newVal)
})

watch(
  () => props.player,
  (newPlayer) => {
    detailPlayer.value = { ...newPlayer }
    log.debug(`open player detail dialog ${detailPlayer.value}`)
  }
)

const closeDialog = () => {
  emit('update:dialog', false)
  emit('dialogClosed', true)
  detailDialog.value = false
}

const savePlayer = async (closeAfterSave: boolean) => {
  if (props.isNew) {
    await playerStore.addPlayer(detailPlayer.value)
  } else {
    log.debug('FOO', typeof detailPlayer.value.birthYear)
    if (detailPlayer.value.birthYear === '') {
      detailPlayer.value.birthYear = null
    }
    await playerStore.updatePlayer(detailPlayer.value)
  }
  if (closeAfterSave) {
    closeDialog()
  }
}
</script>
