import { useState } from 'react'

/**
 * @param key localStorage key
 * @param initialState only used if there is no value in localStorage
 */
export default function useLocalStorage<S = undefined>(
  key: string,
  initialState: S
) {
  const savedValue = localStorage.getItem(key)
  const [state, _setState] = useState<S>(
    savedValue ? JSON.parse(savedValue) : initialState
  )

  function setState(newState: S) {
    localStorage.setItem(key, JSON.stringify(newState))
    _setState(newState)
  }

  function resetState() {
    localStorage.removeItem(key)
    _setState(initialState)
  }

  return [state, setState, resetState] as const
}
