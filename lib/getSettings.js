import { supabase } from './supabase'

export async function getSettings() {
  const { data } = await supabase.from('settings').select('*')
  if (!data) return {}
  return Object.fromEntries(data.map(row => [row.key, row.value]))
}

export function getSiteState(settings) {
  const now = new Date()
  const start  = new Date(settings.voting_start)
  const end    = new Date(settings.voting_end)
  const until  = new Date(settings.show_results_until)
  const isOpen = settings.voting_open === 'true'

  if (isOpen && now >= start && now <= end) return 'voting'
  if (now > end && now <= until)            return 'results'
  if (now > until)                          return 'countdown_next'
  return 'countdown'  // before voting opens this year
}
