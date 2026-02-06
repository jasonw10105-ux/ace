
import { supabase } from '../lib/supabase'

export interface SchemaInfo {
  fields: string[]
  fieldTypes: Array<{ field: string; type: string; value: any }>
  sampleData: any
  error?: string
}

export async function discoverProfilesSchema(): Promise<SchemaInfo> {
  try {
    const { data, error } = await (supabase.from('profiles').select('*').limit(1) as any)
    if (error || !data?.[0]) return { fields: [], fieldTypes: [], sampleData: null, error: error?.message || 'No data' }
    
    const record = data[0]
    return {
      fields: Object.keys(record),
      fieldTypes: Object.entries(record).map(([k, v]) => ({ field: k, type: typeof v, value: v })),
      sampleData: record
    }
  } catch (e: any) {
    return { fields: [], fieldTypes: [], sampleData: null, error: e.message }
  }
}
