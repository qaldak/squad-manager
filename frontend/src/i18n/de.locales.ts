import type { ITranslations } from '@/i18n/ITranslations.ts'

export const deTranslations: ITranslations = {
  player: {
    firstname: 'Vorname',
    name: 'Name',
    position: 'Position',
    yearOfBirth: 'Jahrgang',
    birthday: 'Geburtsdatum',
    players: 'Spieler',
    buttons: {
      newPlayer: 'Neuer Spieler erfassen'
    },
    titles: {
      newPlayer: 'Neuer Spieler',
      editPlayer: 'Spieler bearbeiten'
    }
  },
  schedule: {
    date: 'Datum',
    location: 'Ort',
    eventType: 'Terminart',
    matchType: 'Matchtyp',
    schedules: 'Spielplan',
    buttons: {
      newSchedule: 'Neuer Termin erfassen',
      inclPastFilter: 'inkl. vergangene'
    },
    enums: {
      eventType: {
        game: 'Match',
        training: 'Training'
      },
      matchType: {
        cup: 'Cup Spiel',
        league: 'Liga-Spiel',
        indoor: 'Hallenturnier',
        friendly: 'Freundschaftsspiel'
      }
    }
  },
  playerEngagement: {
    manuallyAdded: 'Manuell hinzugefügt',
    status: 'Status',
    assignPlayer: 'Spieler zuteilen',
    buttons: {
      assignPlayer: 'Spieler zuteilen',
      generateProposal: 'Kader generieren',
      confirmProposal: 'Kader bestätigen'
    },
    enums: {
      status: {
        canceled: 'Abgesagt',
        definitive: 'Definitiv',
        provisional: 'Provisorisch'
      }
    },
    messages: {
      deletePlayer: 'Spieler entfernen',
      playerAlreadyAssigned: 'Spieler bereits hinzugefügt',
      playerAssigned: 'Spieler erfolgreich hinzugefügt',
      playerDeleted: 'Spieler erfolgreich gelöscht',
      searchPlayer: 'Suche Name oder Vorname'
    },
    titles: {
      playerEngagement: 'Spielerzuteilung'
    }
  },
  common: {
    buttons: {
      cancel: 'Abbrechen',
      save: 'Speichern',
      saveAndClose: 'Speichern und schliessen'
    },
    messages: {
      fieldRequired: 'Eingabe ist zwingend'
    }
  }
}
