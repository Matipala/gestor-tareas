import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TaskManager from '../components/TaskManager'
import CategoryManager from '../components/CategoryManager'

export default function Dashboard() {
    const { session, signOut } = useAuth()
    const [view, setView] = useState('tasks')

    if (session === undefined) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                Cargando…
            </div>
        )
    }
    if (!session) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                No autorizado
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
            <Navbar view={view} onChangeView={setView} />

            <div className="flex-1 overflow-auto pt-16">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">
                            Bienvenido, {session.user.email}
                        </h1>
                        <button
                            onClick={() => signOut()}
                            className="text-red-500 hover:text-red-700"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="w-full h-full">
                        {view === 'tasks' ? (
                            <TaskManager />
                        ) : (
                            <CategoryManager />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
