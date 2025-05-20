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
    enums: {
      position: {
        defender: 'Verteidiger',
        forward: 'Stürmer',
        goalkeeper: 'Torhüter',
        midfielder: 'Mittelfeld'
      }
    },
    titles: {
      newPlayer: 'Neuer Spieler',
      editPlayer: 'Spieler bearbeiten'
    }
  },
  schedule: {
    date: 'Datum',
    location: 'Ort',
    scheduleType: 'Terminart',
    matchType: 'Matchtyp',
    schedules: 'Spielplan',
    buttons: {
      newSchedule: 'Neuer Termin erfassen',
      inclPastFilter: 'inkl. vergangene'
    },
    enums: {
      scheduleType: {
        game_day: 'Match',
        training: 'Training'
      },
      matchType: {
        cup: 'Cup Spiel',
        league: 'Meisterschaft',
        indoor: 'Hallenturnier',
        friendly: 'Freundschaftsspiel'
      }
    },
    titles: {
      editSchedule: 'Termin bearbeiten',
      newSchedule: 'Termin erfassen'
    }
  },
  playerEngagement: {
    manuallyAdded: 'Manuell hinzugefügt',
    status: 'Status',
    assignPlayer: 'Spieler zuteilen',
    totalParticipation: 'Teilnahmen',
    totalCancellation: 'Absagen',
    buttons: {
      assignPlayer: 'Spieler zuteilen',
      generateProposal: 'Kader generieren',
      confirmProposal: 'Kader bestätigen',
      copyToClipboard: 'Kader kopieren'
    },
    enums: {
      status: {
        CANCELED: 'Abgesagt',
        DEFINITIVE: 'Definitiv',
        PROVISIONAL: 'Provisorisch'
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
    bool: {
      false: 'Nein',
      true: 'Ja'
    },
    buttons: {
      cancel: 'Abbrechen',
      close: 'Schliessen',
      save: 'Speichern',
      saveAndClose: 'Speichern und schliessen'
    },
    messages: {
      fieldRequired: 'Eingabe ist zwingend',
      noDataAvailable: 'Keine Daten verfügbar',
      errorReadingData: 'Fehler beim Lesen der Daten',
      copySuccessfully: 'Daten erfolgreich in die Zwischenablage kopiert'
    }
  }
}
