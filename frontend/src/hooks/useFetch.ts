// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react'
import { Client, HttpError } from '../services/httpClient'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await Client.get<T>(url)
      setData(res)
    } catch (e) {
      if (e instanceof HttpError) {
        setError(e.details?.message ?? e.message)
      } else {
        setError('Произошла ошибка при загрузке данных')
      }
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
