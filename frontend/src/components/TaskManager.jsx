import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase-Client.js'

function TaskCard({ task, categories, onSave, onDelete, onChange }) {
    const [editing, setEditing] = useState(false)

    return (
        <div className="bg-gray-800 p-4 mb-4 rounded-lg shadow">
            <input
                className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                value={task?.titulo}
                disabled={!editing}
                onChange={e => onChange(task?.id, 'titulo', e.target.value)}
            />
            <textarea
                className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                value={task?.descripcion}
                disabled={!editing}
                onChange={e => onChange(task?.id, 'descripcion', e.target.value)}
            />
            <input
                className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                type="date"
                value={task?.fecha}
                disabled={!editing}
                onChange={e => onChange(task?.id, 'fecha', e.target.value)}
            />
            <select
                className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                value={task?.categoria_id || ''}
                disabled={!editing}
                onChange={e => onChange(task?.id, 'categoria_id', e.target.value)}
            >
                <option value="">— Sin categoría —</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.nombre}
                    </option>
                ))}
            </select>
            <label className="flex items-center text-white mb-4">
                <input
                    type="checkbox"
                    checked={task?.estado}
                    disabled={!editing}
                    onChange={e => onChange(task?.id, 'estado', e.target.checked)}
                    className="mr-2"
                />
                Completada
            </label>
            <div className="flex justify-between">
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-blue-400 hover:underline"
                    >
                        Editar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            onSave(task?.id)
                            setEditing(false)
                        }}
                        className="text-green-400 hover:underline"
                    >
                        Guardar
                    </button>
                )}
                <button
                    onClick={() => onDelete(task?.id)}
                    className="text-red-500 hover:underline"
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default function TaskManager() {
    const { session } = useAuth()
    const userId = session?.user?.id

    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])

    const [newTitulo, setNewTitulo] = useState('')
    const [newDescripcion, setNewDescripcion] = useState('')
    const [newFecha, setNewFecha] = useState(
        new Date().toISOString().split('T')[0]
    )
    const [newCategoriaId, setNewCategoriaId] = useState('')
    const [newEstado, setNewEstado] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchCategories()
            fetchTasks()
        }
    }, [userId])

    async function fetchCategories() {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('user_id', userId)
            .order('nombre', { ascending: true })
        if (error) console.error('Error fetching categories:', error)
        else setCategories(data || [])
    }

    async function fetchTasks() {
        const { data, error } = await supabase
            .from('tareas')
            .select('*')
            .eq('user_id', userId)
            .order('fecha', { ascending: true })
        if (error) console.error('Error fetching tasks:', error)
        else setTasks(data || [])
    }

    async function addTask() {
        if (!newTitulo.trim()) return
        const newTask = {
            titulo: newTitulo,
            descripcion: newDescripcion,
            fecha: newFecha,
            estado: newEstado,
            categoria_id: newCategoriaId || null,
            user_id: userId,
        }
        const { data, error } = await supabase
            .from('tareas')
            .insert([newTask])
            .single()
        if (error) console.error('Error adding task:', error)
        else setTasks(prev => [...prev, data])

        setNewTitulo('')
        setNewDescripcion('')
        setNewFecha(new Date().toISOString().split('T')[0])
        setNewCategoriaId('')
        setNewEstado(false)
    }

    async function saveTask(id) {
        const task = tasks.find(t => t.id === id)
        if (!task) return
        const { data, error } = await supabase
            .from('tareas')
            .update({
                titulo: task.titulo,
                descripcion: task.descripcion,
                fecha: task.fecha,
                estado: task.estado,
                categoria_id: task.categoria_id || null,
            })
            .eq('id', id)
            .single()
        if (error) console.error('Error saving task:', error)
        else setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    }

    async function deleteTask(id) {
        const { error } = await supabase.from('tareas').delete().eq('id', id)
        if (error) console.error('Error deleting task:', error)
        else setTasks(prev => prev.filter(t => t.id !== id))
    }

    function handleTaskChange(id, field, value) {
        setTasks(prev =>
            prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
        )
    }

    if (session === undefined) return <div>Loading…</div>
    if (!session) return <div>Acceso no autorizado</div>

    return (
        <div className="p-4">
            {/* Formulario creación */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-white mb-4">
                    Crear Nueva Tarea
                </h2>
                <input
                    className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                    placeholder="Título"
                    value={newTitulo}
                    onChange={e => setNewTitulo(e.target.value)}
                />
                <textarea
                    className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                    placeholder="Descripción"
                    value={newDescripcion}
                    onChange={e => setNewDescripcion(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <input
                        className="bg-gray-700 text-white p-2 rounded"
                        type="date"
                        value={newFecha}
                        onChange={e => setNewFecha(e.target.value)}
                    />
                    <select
                        className="bg-gray-700 text-white p-2 rounded"
                        value={newCategoriaId}
                        onChange={e => setNewCategoriaId(e.target.value)}
                    >
                        <option value="">— Sin categoría —</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <label className="flex items-center text-white mb-4">
                    <input
                        type="checkbox"
                        checked={newEstado}
                        onChange={e => setNewEstado(e.target.checked)}
                        className="mr-2"
                    />
                    Completada
                </label>
                <button
                    onClick={addTask}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                    Añadir Tarea
                </button>
            </div>

            {/* Tablero */}
            <div className="flex space-x-4 overflow-auto">
                {/* Sin categoría */}
                <div className="min-w-[250px] bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-2">Sin categoría</h3>
                    {tasks
                        .filter(t => !t.categoria_id)
                        .map(task => (
                            <TaskCard
                                key={task?.id}
                                task={task}
                                categories={categories}
                                onSave={saveTask}
                                onDelete={deleteTask}
                                onChange={handleTaskChange}
                            />
                        ))}
                </div>

                {/* Por cada categoría */}
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="min-w-[250px] bg-gray-700 p-4 rounded-lg"
                    >
                        <h3 className="text-white font-bold mb-2">{cat.nombre}</h3>
                        {tasks
                            .filter(t => t.categoria_id === cat.id)
                            .map(task => (
                                <TaskCard
                                    key={task?.id}
                                    task={task}
                                    categories={categories}
                                    onSave={saveTask}
                                    onDelete={deleteTask}
                                    onChange={handleTaskChange}
                                />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    )
}