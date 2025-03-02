<template>
  <v-dialog v-model="detailDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isNew ? 'New Player' : 'Edit Player' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="detailPlayer.firstname"
            label="Firstname"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="detailPlayer.name"
            label="Name"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            clearable
            v-model.number="detailPlayer.birthYear"
            label="Birth year"
            :rules="[rules.birthYear]"
          ></v-text-field>
          <v-select
            clearable
            v-model="detailPlayer.position"
            :items="positions"
            label="Position"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="savePlayer(false)">Save</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="savePlayer(true)">Save and close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Position, type Player } from '@/types/player.type'
import { usePlayerStore } from '@/stores/player.store'

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

const positions = Object.values(Position)

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
    console.log('Foo: ', props.player)
    detailPlayer.value = { ...newPlayer }
    console.log('Foo: ', detailPlayer.value)
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
    console.log('FOO', typeof detailPlayer.value.birthYear)
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
