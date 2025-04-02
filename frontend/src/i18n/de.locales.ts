import type { ITranslations } from '@/i18n/ITranslations.ts'

export const deTranslations: ITranslations = {
  player: {
    firstname: 'Vorname',
    name: 'Name',
    position: 'Position',
    year_of_birth: 'Jahrgang',
    birthday: 'Geburtsdatum',
    players: 'Spieler',
    buttons: {
      new_player: 'Neuer Spieler erfassen'
    }
  },
  schedule: {
    date: 'Datum',
    location: 'Ort',
    event_type: 'Terminart',
    game: 'Match',
    training: 'Training',
    match_type: 'Matchtyp',
    cup: 'Cup Spiel',
    league: 'Liga-Spiel',
    indoor: 'Hallenturnier',
    friendly: 'Freundschaftsspiel',
    schedules: 'Spielplan',
    buttons: {
      new_schedule: 'Neuer Termin erfassen',
      incl_past: 'inkl. vergangene'
    }
  },
  playerEngagement: {
    definitive: 'Definitiv',
    canceled: 'Abgesagt',
    provisional: 'Provisorisch',
    manually_added: 'Manuell hinzugefügt',
    state: 'Status',
    assign_player: 'Spieler zuteilen',
    player_engagement: 'Spielerzuteilung',
    buttons: {
      assign_player: 'Zuteilen',
      generate_squad: 'Kader generieren',
      confirm_squad: 'Kader bestätigen'
    }
  },
  common: {
    buttons: {
      cancel: 'Abbrechen',
      save: 'Speichern',
      save_and_close: 'Speichern und schliessen'
    },
    messages: {
      field_required: 'Eingabe ist zwingend',
      player_assigned_success: 'Spieler erfolgreich hinzugefügt',
      player_already_assigned: 'Spieler bereits hinzugefügt'
    }
  }
}
