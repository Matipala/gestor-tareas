import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase-Client.js'

export default function CategoryManager() {
    const { session } = useAuth()
    const userId = session?.user?.id

    const [categories, setCategories] = useState([])
    const [newCat, setNewCat] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return

        async function load() {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('user_id', userId)
                .order('nombre', { ascending: true })

            if (error) console.error('Error fetching categories:', error)
            else setCategories(data || [])

            setLoading(false)
        }

        load()
    }, [userId])

    if (loading) {
        return <div className="p-4 text-center">Cargando categorías…</div>
    }
    if (!session) {
        return <div className="p-4 text-center">No autorizado</div>
    }

    const addCategory = async () => {
        const name = newCat.trim()
        if (!name) return

        const { data, error } = await supabase
            .from('categorias')
            .insert([{ nombre: name, user_id: userId }])
            .single()

        if (error) console.error('Error adding category:', error)
        else setCategories(prev => [...prev, data])

        setNewCat('')
    }

    const saveCategory = async id => {
        const cat = categories.find(c => c.id === id)
        if (!cat) return

        const { data, error } = await supabase
            .from('categorias')
            .update({ nombre: cat.nombre })
            .eq('id', id)
            .single()

        if (error) console.error('Error saving category:', error)
        else {
            setCategories(prev =>
                prev.map(c => (c.id === id ? data : c))
            )
            setEditingId(null)
        }
    }

    const deleteCategory = async id => {
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id)

        if (error) console.error('Error deleting category:', error)
        else {
            setCategories(prev => prev.filter(c => c.id !== id))
            if (editingId === id) setEditingId(null)
        }
    }

    const handleNameChange = (id, name) => {
        setCategories(prev =>
            prev.map(c => (c.id === id ? { ...c, nombre: name } : c))
        )
    }

    return (
        <div className="space-y-6">
            {/* Nueva categoría */}
            <div className="flex gap-2">
                <input
                    className="flex-1 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Nueva categoría"
                    value={newCat}
                    onChange={e => setNewCat(e.target.value)}
                />
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    onClick={addCategory}
                >
                    Añadir
                </button>
            </div>

            {/* Listado de categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                    const isEditing = editingId === cat.id
                    return (
                        <div
                            key={cat.id}
                            className="bg-gray-800 p-4 rounded-lg shadow flex flex-col"
                        >
                            <input
                                className="bg-gray-700 text-white p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                value={cat.nombre}
                                disabled={!isEditing}
                                onChange={e => handleNameChange(cat.id, e.target.value)}
                            />
                            <div className="mt-auto flex gap-2">
                                {!isEditing ? (
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        onClick={() => setEditingId(cat.id)}
                                    >
                                        Editar
                                    </button>
                                ) : (
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                        onClick={() => saveCategory(cat.id)}
                                    >
                                        Guardar
                                    </button>
                                )}
                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                    onClick={() => deleteCategory(cat.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}