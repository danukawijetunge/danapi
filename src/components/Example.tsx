import React, { useEffect, useState } from 'react'
import type { DataItem } from '../api'
import { getItems, createItem, updateItem, deleteItem } from '../api'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

export const Example: React.FC = () => {
  const [items, setItems] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', usage: '', key: '' })

  // Fetch all items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems()
        setItems(data)
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  // Open/close modal
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm({ name: '', type: '', usage: '', key: '' })
  }

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Create a new item from modal
  const handleSubmit = async () => {
    try {
      const newItem = await createItem(form)
      setItems([...items, newItem[0]])
      handleClose()
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  // Update an item
  const handleUpdate = async (id: number) => {
    try {
      const updatedItem = await updateItem(id, {
        // Add your update data here
        name: 'Updated Name'
      })
      setItems(items.map(item => 
        item.id === id ? updatedItem[0] : item
      ))
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  // Delete an item
  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id)
      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>Add</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new API key</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Type"
            name="type"
            fullWidth
            value={form.type}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Usage"
            name="usage"
            fullWidth
            value={form.usage}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Key"
            name="key"
            fullWidth
            value={form.key}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Type: {item.type}</p>
          <p>Usage: {item.usage}</p>
          <p>Key: {item.key}</p>
          <Button onClick={() => handleUpdate(item.id!)}>Update</Button>
          <Button onClick={() => handleDelete(item.id!)}>Delete</Button>
        </div>
      ))}
    </div>
  )
} 