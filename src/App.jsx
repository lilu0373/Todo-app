import { useState, useMemo } from 'react'
import { useTodos } from './hooks/useTodos'
import { useCategories } from './hooks/useCategories'
import { useReminders } from './hooks/useReminders'
import { expandAllForDays } from './utils/recurrence'
import Sidebar from './components/Sidebar/Sidebar'
import Calendar from './components/Calendar/Calendar'
import TodoList from './components/TodoList/TodoList'
import TodoModal from './components/TodoModal/TodoModal'
import CategoryManager from './components/CategoryManager/CategoryManager'
import ReminderPanel from './components/ReminderPanel/ReminderPanel'
import styles from './App.module.css'

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, clearCategoryFromTodos } =
    useTodos()
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryColor,
    getCategoryName,
  } = useCategories()
  const { upcomingReminders, reminderCount } = useReminders(todos)

  const [viewMode, setViewMode] = useState('calendar')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [todoModal, setTodoModal] = useState({ open: false, todo: null, date: null })
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [reminderPanelOpen, setReminderPanelOpen] = useState(false)

  // Expand recurring todos for list view (next 90 days)
  const expandedTodos = useMemo(
    () => expandAllForDays(todos, new Date(), 90),
    [todos]
  )

  // Filter by selected categories
  const filteredTodos = useMemo(() => {
    const source = viewMode === 'list' ? expandedTodos : todos
    if (selectedCategoryIds.length === 0) return source
    return source.filter((t) => selectedCategoryIds.includes(t.categoryId))
  }, [todos, expandedTodos, selectedCategoryIds, viewMode])

  // Calendar gets its own expanded+filtered todos
  const calendarTodos = useMemo(() => {
    if (selectedCategoryIds.length === 0) return expandedTodos
    return expandedTodos.filter((t) => selectedCategoryIds.includes(t.categoryId))
  }, [expandedTodos, selectedCategoryIds])

  const handleCategoryToggle = (catId) => {
    if (catId === null) {
      setSelectedCategoryIds([])
    } else {
      setSelectedCategoryIds((prev) =>
        prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
      )
    }
  }

  const handleDayClick = (year, month, day) => {
    setTodoModal({ open: true, todo: null, date: { year, month, day } })
  }

  const handleTodoClick = (todo) => {
    // If it's a virtual recurring instance, find the template
    if (todo.recurrence?.parentId) {
      const template = todos.find((t) => t.id === todo.recurrence.parentId)
      if (template) {
        setTodoModal({ open: true, todo: template, date: null })
        return
      }
    }
    setTodoModal({ open: true, todo, date: null })
  }

  const handleSave = (data) => {
    if (data.id) {
      updateTodo(data.id, data)
    } else {
      addTodo(data)
    }
  }

  const handleDeleteCategory = (id) => {
    deleteCategory(id)
    clearCategoryFromTodos(id)
  }

  const handleToggle = (id) => {
    // If toggling a virtual recurring instance, create a concrete instance
    if (typeof id === 'string' && id.includes('_')) {
      const virtualTodo = expandedTodos.find((t) => t.id === id)
      if (virtualTodo) {
        addTodo({
          ...virtualTodo,
          completed: true,
          recurrence: { ...virtualTodo.recurrence },
        })
        return
      }
    }
    toggleComplete(id)
  }

  return (
    <div className={styles.layout}>
      <Sidebar
        viewMode={viewMode}
        onViewChange={setViewMode}
        categories={categories}
        todos={todos}
        selectedCategoryIds={selectedCategoryIds}
        onCategoryToggle={handleCategoryToggle}
        onNewTodo={() => setTodoModal({ open: true, todo: null, date: null })}
        onManageCategories={() => setCategoryModalOpen(true)}
        onOpenReminders={() => setReminderPanelOpen(true)}
        reminderCount={reminderCount}
      />

      <main className={styles.main}>
        {viewMode === 'calendar' ? (
          <Calendar
            todos={calendarTodos}
            onDayClick={handleDayClick}
            onTodoClick={handleTodoClick}
            getCategoryColor={getCategoryColor}
          />
        ) : (
          <TodoList
            todos={filteredTodos}
            getCategoryColor={getCategoryColor}
            getCategoryName={getCategoryName}
            onToggle={handleToggle}
            onTodoClick={handleTodoClick}
          />
        )}
      </main>

      <TodoModal
        isOpen={todoModal.open}
        onClose={() => setTodoModal({ open: false, todo: null, date: null })}
        onSave={handleSave}
        onDelete={deleteTodo}
        todo={todoModal.todo}
        categories={categories}
        selectedDate={todoModal.date}
      />

      <CategoryManager
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={handleDeleteCategory}
      />

      <ReminderPanel
        isOpen={reminderPanelOpen}
        onClose={() => setReminderPanelOpen(false)}
        reminders={upcomingReminders}
        getCategoryColor={getCategoryColor}
      />
    </div>
  )
}
