import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async e => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const { error } = await signIn(email, password)
        if (error) setError(error.message)
        else navigate('/dashboard')
        setLoading(false)
    }

    return (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Inicia sesión
                </h1>

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}

                <p className="mt-6 text-center text-gray-400 text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-green-400 hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}
