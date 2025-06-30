import { supabase } from './supabaseClient'

// Define the type for your data
export interface DataItem {
  id?: number
  created_at?: string
  // Add other fields based on your table structure
  [key: string]: any
}

// Create a new item
export const createItem = async (data: Omit<DataItem, 'id' | 'created_at'>) => {
  const { data: newItem, error } = await supabase
    .from('items')
    .insert([data])
    .select()

  if (error) throw error
  return newItem
}

// Read all items
export const getItems = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Read a single item
export const getItem = async (id: number) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Update an item
export const updateItem = async (id: number, updates: Partial<DataItem>) => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

// Delete an item
export const deleteItem = async (id: number) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)

  if (error) throw error
}