'use client'

import { useState, useCallback, useEffect } from 'react'

const storageName: string = 'userData'
 interface IUserData  {
  userId: string | number,
  token: string | null,
  isAdmin: boolean,
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const login = useCallback((jwtToken: string | null, id: string | number | null, admin = false) => {
    setToken(jwtToken)
    setUserId(id)
    setIsAdmin(admin)

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
        isAdmin: admin,
      }),
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setIsAdmin(false)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    
    const userStorageData = localStorage.getItem(storageName)
    let data: IUserData = { userId: 0, token: '', isAdmin: false}
    if (userStorageData) {
      data = JSON.parse(userStorageData)
    }

    if (data && data.token) {
      login(data.token, data.userId, data.isAdmin)
      setIsAdmin(data.isAdmin)
    }
    
  }, [login])

  return { login, logout, token, userId, isAdmin }
}

//export default useAuth
