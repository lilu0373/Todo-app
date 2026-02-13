import { useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { defaultCategories } from '../constants/defaults'
import { generateId } from '../utils/idGenerator'

const STORAGE_KEY = 'todo-app-categories'

export function useCategories() {
  const [categories, setCategories] = useState(() =>
    loadFromStorage(STORAGE_KEY, defaultCategories)
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, categories)
  }, [categories])

  const addCategory = (name, color) => {
    const category = { id: generateId(), name, color }
    setCategories((prev) => [...prev, category])
    return category
  }

  const updateCategory = (id, changes) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...changes } : c))
    )
  }

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const getCategoryColor = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat ? cat.color : '#4a90e2'
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat ? cat.name : ''
  }

  return { categories, addCategory, updateCategory, deleteCategory, getCategoryColor, getCategoryName }
}
