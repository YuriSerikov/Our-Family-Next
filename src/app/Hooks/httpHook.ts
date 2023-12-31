'use client'

import { useState, useCallback } from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url: string, method = 'GET', body: any = '', headers = {}) => {
    setLoading(true)
     
    try {
      if (body) {
        body = JSON.stringify(body)
        headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }

      const response = await fetch(url, { method, body, headers, cache: 'no-store' })
      const data = await response.json()

      if (!response.ok) {
        return data
        //throw new Error(data.message || "Что-то пошло не так");
      }

      setLoading(false)

      return data
    } catch (e:any) {
      setLoading(false)
      console.log('ошибка из хука HTTP', e.message)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError } 
}
