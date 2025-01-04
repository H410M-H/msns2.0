'use client'

import { createContext, useContext, useState } from 'react'
import { type User } from '~/server/api/routers/user'

interface UserContextType {
  user: User | null
  updateUser: (data: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'msns',
    email: 'admin@msns.edu.pk',
    avatar: 'favicon.ico',
    bio: '',
    notifications: true,
    marketing: false,
    security_emails: true
  })

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

