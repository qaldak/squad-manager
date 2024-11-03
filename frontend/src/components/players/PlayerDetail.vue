<template>
  <v-dialog v-model="detailDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isNew ? 'Neuer Spieler' : 'Spieler bearbeiten' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="detailPlayer.firstname" label="Vorname" :rules="[rules.required]"
            required></v-text-field>
          <v-text-field v-model="detailPlayer.name" label="Name" :rules="[rules.required]" required></v-text-field>
          <v-text-field v-model="detailPlayer.birthYear" label="Geburtsjahr"></v-text-field>
          <v-select v-model="detailPlayer.position" :items="positions" label="Position"></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">Abbrechen</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="savePlayer(false)">Speichern</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="savePlayer(true)">Speichern und schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Position, type Player } from '@/types/player.type';
import { usePlayerStore } from '@/stores/player.store';

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    player: {
      type: Object as () => Player,
      required: true
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:dialog', 'dialogClosed'],
  setup(props, { emit }) {
    const playerStore = usePlayerStore();
    const detailDialog = ref(props.dialog);
    const detailPlayer = ref({ ...props.player });
    const valid = ref(false);
    const rules = {
      required: (value: string) => !!value || 'This field is required'
    };

    const positions = Object.values(Position);

    watch(
      () => props.dialog,
      (newVal) => {
        detailDialog.value = newVal;
      }
    );

    watch(detailDialog, (newVal) => {
      emit('update:dialog', newVal);
    });

    watch(
      () => props.player,
      (newPlayer) => {
        console.log('Foo: ', props.player);
        detailPlayer.value = { ...newPlayer };
        console.log('Foo: ', detailPlayer.value);
      }
    );

    const closeDialog = () => {
      emit('update:dialog', false);
      emit('dialogClosed', true);
      detailDialog.value = false;
    };

    const savePlayer = async (closeAfterSave: boolean) => {
      if (props.isNew) {
        await playerStore.addPlayer(detailPlayer.value);
      } else {
        await playerStore.updatePlayer(detailPlayer.value);
      }
      if (closeAfterSave) {
        closeDialog();
      }
    };

    return {
      closeDialog,
      savePlayer,
      positions,
      valid,
      rules,
      detailDialog: detailDialog,
      detailPlayer: detailPlayer
    };
  }
});
</script>
