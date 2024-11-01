import axios from 'axios'
import type { Player } from '@/types/player.type'

const API_URL = '/api/players'

export const getPlayers = async (): Promise<Player[]> => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addPlayer = async (player: Player): Promise<Player> => {
  const response = await axios.post(API_URL, player)
  return response.data
}

export const updatePlayer = async (player: Player): Promise<Player> => {
  const response = await axios.put(`${API_URL}/${player.playerId}`, player)
  return response.data
}
