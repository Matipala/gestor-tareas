import React from 'react'

export default function Navbar({ view, onChangeView }) {
    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex space-x-4 z-10">
            <button
                className={`px-3 py-1 rounded ${view === 'tasks' ? 'bg-gray-600' : 'hover:bg-gray-700'
                    }`}
                onClick={() => onChangeView('tasks')}
            >
                Tareas
            </button>
            <button
                className={`px-3 py-1 rounded ${view === 'categories' ? 'bg-gray-600' : 'hover:bg-gray-700'
                    }`}
                onClick={() => onChangeView('categories')}
            >
                Categorías
            </button>
        </nav>
    )
}
