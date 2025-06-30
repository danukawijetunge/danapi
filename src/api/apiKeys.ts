import { supabase } from '../supabaseClient';

export async function getItems() {
  const { data, error } = await supabase.from('items').select('*');
  if (error) throw error;
  return data;
}

export async function createItem(item: any) {
  const { data, error } = await supabase.from('items').insert([item]);
  if (error) throw error;
  return data;
}

export async function updateItem(id: number, item: any) {
  const { data, error } = await supabase.from('items').update(item).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteItem(id: number) {
  const { data, error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
  return data;
} 