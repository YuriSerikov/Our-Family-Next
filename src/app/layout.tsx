'use client'

import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'

import TheFooter from './components/TheFooter'
import Navbar from './components/Navbar'
import { PersonProvider } from './context/PersonContext'
import { PersonsListProvider } from './context/PersonsListContext'
import AuthContext from "./context/AuthContext";
import type { Metadata } from 'next'
//import { Providers } from './components/Providers/Providers'
import {useAuth} from "./Hooks/auth.hook";


export const metadata: Metadata = {
  title: 'Our Family',
  description: 'Family tree and photos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  const { token, login, logout, userId, isAdmin } = useAuth();
console.log(token)
  const isAuthenticated = !!token;
  
  
  return (
    <html lang="en">
      <body>
        <AuthContext.Provider
          value={{ token, login, logout, userId, isAdmin, isAuthenticated }}
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
