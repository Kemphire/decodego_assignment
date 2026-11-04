import { useEffect, useRef, useState } from 'react'
import { type Bill, getBills } from '../api'
import { useHomes } from '../hooks/useHomes'
import { errorMessage } from '../utils/errorMessage'
import { BillList } from './BillList'
import { HomeSelectForm } from './HomeSelectForm'

type BillsState =
  | { status: 'idle' }
  | { status: 'loading'; homeId: string }
  | { status: 'success'; homeId: string; bills: Bill[] }
  | { status: 'error'; homeId: string; message: string }

export function Home() {
  const { state: homesState, reload: reloadHomes } = useHomes()
  const [homeId, setHomeId] = useState('')
  const [state, setState] = useState<BillsState>({ status: 'idle' })
  const request = useRef<AbortController | null>(null)
  const homes = homesState.status === 'success' ? homesState.homes : []

  useEffect(() => () => request.current?.abort(), [])

  async function loadBills(id: string) {
    const trimmedId = id.trim()
    if (!trimmedId) return

    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setState({ status: 'loading', homeId: trimmedId })

    try {
      const bills = await getBills(trimmedId, controller.signal)
      if (!controller.signal.aborted) {
        setState({ status: 'success', homeId: trimmedId, bills })
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        setState({ status: 'error', homeId: trimmedId, message: errorMessage(error) })
      }
    }
  }

  return (
    <main>
      <h1>Bill Splitter</h1>
      {homesState.status === 'loading' && <p role="status">Loading homes…</p>}
      {homesState.status === 'error' && (
        <>
          <p role="alert">{homesState.message}</p>
          <button type="button" onClick={() => void reloadHomes()}>
            Retry loading homes
          </button>
        </>
      )}
      {homesState.status === 'success' && (
        <HomeSelectForm
          homes={homes}
          homeId={homeId}
          loading={state.status === 'loading'}
          onHomeIdChange={setHomeId}
          onSubmit={() => void loadBills(homeId)}
        />
      )}

      {state.status === 'idle' && homes.length > 0 && <p>Select a home to view bills.</p>}
      {state.status === 'loading' && <p role="status">Loading bills…</p>}
      {state.status === 'error' && (
        <>
          <p role="alert">{state.message}</p>
          <button type="button" onClick={() => void loadBills(state.homeId)}>
            Retry
          </button>
        </>
      )}
      {state.status === 'success' && (
        <BillList
          homeName={homes.find((home) => home.id === state.homeId)?.name ?? state.homeId}
          bills={state.bills}
          onReload={() => void loadBills(state.homeId)}
        />
      )}
    </main>
  )
}
