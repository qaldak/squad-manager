export type ITranslations = {
  player: {
    firstname: string
    name: string
    position: string
    year_of_birth: string
    birthday: string
    players: string
    buttons: {
      new_player: string
    }
  }
  schedule: {
    date: string
    location: string
    event_type: string
    game: string
    training: string
    match_type: string
    cup: string
    league: string
    indoor: string
    friendly: string
    schedules: string
    buttons: {
      new_schedule: string
      incl_past: string
    }
  }
  playerEngagement: {
    definitive: string
    canceled: string
    provisional: string
    manually_added: string
    state: string
    assign_player: string
    player_engagement: string
    buttons: {
      assign_player: string
      generate_squad: string
      confirm_squad: string
    }
  }
  common: {
    buttons: {
      cancel: string
      save: string
      save_and_close: string
    }
    messages: {
      field_required: string
      player_assigned_success: string
      player_already_assigned: string
    }
  }
  textes?: {
    welcome?: string
  }
}
