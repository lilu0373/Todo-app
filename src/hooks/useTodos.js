import { useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { generateId } from '../utils/idGenerator'

const STORAGE_KEY = 'todo-app-todos'

export function useTodos() {
  const [todos, setTodos] = useState(() => loadFromStorage(STORAGE_KEY, []))

  useEffect(() => {
    saveToStorage(STORAGE_KEY, todos)
  }, [todos])

  const addTodo = (data) => {
    const now = new Date().toISOString()
    const todo = {
      id: generateId(),
      title: data.title,
      description: data.description || '',
      date: data.date,
      time: data.time || '',
      categoryId: data.categoryId || '',
      completed: false,
      completedAt: null,
      reminder: data.reminder || false,
      reminderMinutes: data.reminderMinutes || 30,
      recurrence: data.recurrence || null,
      createdAt: now,
      updatedAt: now,
    }
    setTodos((prev) => [...prev, todo])
    return todo
  }

  const updateTodo = (id, changes) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const completed = !t.completed
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const clearCategoryFromTodos = (categoryId) => {
    setTodos((prev) =>
      prev.map((t) => (t.categoryId === categoryId ? { ...t, categoryId: '' } : t))
    )
  }

  return { todos, addTodo, updateTodo, deleteTodo, toggleComplete, clearCategoryFromTodos }
}
