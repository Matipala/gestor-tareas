import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
    const { session } = useAuth()
    if (session === undefined) return <div>Cargando…</div>
    return session ? <>{children}</> : <Navigate to="/login" replace />
}
