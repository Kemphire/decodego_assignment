import { useCallback, useEffect, useRef, useState } from 'react'
import { getHomes, type Home } from '../api'
import { errorMessage } from '../utils/errorMessage'

type HomesState =
  | { status: 'loading' }
  | { status: 'success'; homes: Home[] }
  | { status: 'error'; message: string }

export function useHomes() {
  const [state, setState] = useState<HomesState>({ status: 'loading' })
  const request = useRef<AbortController | null>(null)

  const reload = useCallback(async () => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setState({ status: 'loading' })

    try {
      const homes = await getHomes(controller.signal)
      if (!controller.signal.aborted) {
        setState({ status: 'success', homes })
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        setState({ status: 'error', message: errorMessage(error) })
      }
    }
  }, [])

  useEffect(() => {
    void reload()
    return () => request.current?.abort()
  }, [reload])

  return { state, reload }
}
