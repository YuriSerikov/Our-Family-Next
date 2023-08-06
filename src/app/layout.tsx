'use client'

import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'

import TheFooter from './components/TheFooter'
import Navbar from './components/Navbar'
import { PersonProvider } from './context/PersonContext'
import { PersonsListProvider } from './context/PersonsListContext'
import AuthContext from "./context/AuthContext";
import type { Metadata } from 'next'
import {useAuth} from "./Hooks/auth.hook";
//import { useEffect } from 'react'


export const metadata: Metadata = {
  title: 'Our Family',
  description: 'Family tree and photos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  //const { token, login, logout, userId, isAdmin } = useAuth();
  const auth = useAuth();
  console.log('user tocken=', auth.token)
  
  const isAuthenticated = !!auth.token;
  
  return (
    <html lang="en">
      <body>
        <AuthContext.Provider
          value={{
            token: auth.token,
            login: auth.login,
            logout: auth.logout,
            userId: auth.userId,
            isAdmin: auth.isAdmin,
            isAuthenticated: isAuthenticated
          }}
          >
          <PersonsListProvider>
            <PersonProvider>
              <Navbar />
                <main>
                  {children}
                </main>
            </PersonProvider>
          </PersonsListProvider>
        </AuthContext.Provider>
        
        <TheFooter />
      </body>
    </html>
  )
}
