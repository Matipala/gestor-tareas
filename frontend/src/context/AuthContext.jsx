import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase-Client.js'

const AuthContext = createContext()

export function AuthContextProvider({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando…</div>
    }

    return (
        <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )

    async function signUp(email, password) {
        return supabase.auth.signUp({ email: email.toLowerCase(), password })
    }
    async function signIn(email, password) {
        return supabase.auth.signInWithPassword({ email: email.toLowerCase(), password })
    }
    async function signOut() {
        return supabase.auth.signOut()
    }
}

export const useAuth = () => useContext(AuthContext)
