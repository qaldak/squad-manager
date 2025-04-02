import type { ITranslations } from '@/i18n/ITranslations.ts'

export const enTranslations: ITranslations = {
  player: {
    firstname: 'firstname',
    name: 'name',
    position: 'position',
    year_of_birth: 'year of birth',
    birthday: 'birthday',
    players: 'Players',
    buttons: {
      new_player: 'add new player'
    }
  },
  schedule: {
    date: 'date',
    location: 'location',
    event_type: 'event type',
    game: 'game',
    training: 'training',
    match_type: 'match type',
    cup: 'Cup game',
    league: 'League game',
    indoor: 'Indoor game',
    friendly: 'Friendly game',
    schedules: 'Schedules',
    buttons: {
      new_schedule: 'add new schedule',
      incl_past: 'incl. past'
    }
  },
  playerEngagement: {
    definitive: 'definitive',
    canceled: 'canceled',
    provisional: 'provisional',
    manually_added: 'manually added',
    state: 'state',
    assign_player: 'Assign player',
    player_engagement: 'player engagement',
    buttons: {
      assign_player: 'assign',
      generate_squad: 'generate squad',
      confirm_squad: 'confirm squad'
    }
  },
  common: {
    buttons: {
      cancel: 'cancel',
      save: 'save',
      save_and_close: 'save and close'
    },
    messages: {
      field_required: 'field is required',
      player_assigned_success: 'Player assigned successfully',
      player_already_assigned: 'Player already assigned.'
    }
  }
}
