import { useEffect, useRef, useState } from 'react'
import { type Bill, getBills } from '../api'
import { useHomes } from '../hooks/useHomes'
import { errorMessage } from '../utils/errorMessage'
import { AppShell } from './AppShell'
import { BillList } from './BillList'
import { HomeSelectForm } from './HomeSelectForm'
import { Icon } from './Icon'

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
    <AppShell>
      <section
        aria-labelledby="home-heading"
        className="border-4 border-ink bg-paper shadow-brutal"
      >
        <div className="flex items-center justify-between gap-4 border-b-4 border-ink bg-do px-5 py-3 sm:px-7">
          <div className="flex items-center gap-3">
            <Icon name="home" className="size-5" />
            <h2 id="home-heading" className="text-sm font-black tracking-wide uppercase">
              Choose your home
            </h2>
          </div>
          <span className="eyebrow hidden sm:inline">01 / Start here</span>
        </div>
        <div className="p-5 sm:p-7">
          {homesState.status === 'loading' && (
            <p role="status" className="flex items-center gap-3 py-3 text-sm font-medium">
              <Icon name="reload" className="size-5 motion-safe:animate-spin" />
              Loading homes…
            </p>
          )}
          {homesState.status === 'error' && (
            <div className="flex flex-wrap items-center justify-between gap-5 border-l-4 border-de bg-de/5 p-4">
              <p role="alert" className="text-sm font-semibold text-red-800">
                {homesState.message}
              </p>
              <button type="button" className="button bg-paper" onClick={() => void reloadHomes()}>
                <Icon name="reload" />
                Retry loading homes
              </button>
            </div>
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
        </div>
      </section>

      {state.status === 'idle' && homes.length > 0 && (
        <section className="mt-10 border-2 border-dashed border-neutral-300 bg-paper px-5 py-12 text-center sm:py-16">
          <div
            aria-hidden="true"
            className="mx-auto mb-6 grid size-14 -rotate-6 place-items-center border-2 border-ink bg-do shadow-brutal-sm"
          >
            <Icon name="receipt" className="size-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Make yourself at home.</h2>
          <p className="mt-2 text-sm text-neutral-600">Select a home to view bills.</p>
          <p className="eyebrow mt-7 text-neutral-500">
            Your bills. Your people. All in one place.
          </p>
        </section>
      )}
      {state.status === 'loading' && (
        <div role="status" className="state-panel mt-10 flex items-center gap-4">
          <Icon name="reload" className="size-6 motion-safe:animate-spin" />
          <p className="text-sm font-semibold">Loading bills…</p>
        </div>
      )}
      {state.status === 'error' && (
        <div className="state-panel mt-10 flex flex-wrap items-center justify-between gap-5 border-de bg-de/5">
          <div className="flex items-start gap-3">
            <Icon name="alert" className="size-5 shrink-0 text-red-800" />
            <p role="alert" className="text-sm font-semibold text-red-800">
              {state.message}
            </p>
          </div>
          <button
            type="button"
            className="button bg-paper"
            onClick={() => void loadBills(state.homeId)}
          >
            <Icon name="reload" />
            Retry
          </button>
        </div>
      )}
      {state.status === 'success' && (
        <BillList
          homeName={homes.find((home) => home.id === state.homeId)?.name ?? state.homeId}
          bills={state.bills}
          onReload={() => void loadBills(state.homeId)}
        />
      )}
    </AppShell>
  )
}
