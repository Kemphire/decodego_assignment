import { useEffect, useRef, useState } from 'react'
import { type Bill, payShare } from '../api'
import { errorMessage } from '../utils/errorMessage'
import { Icon } from './Icon'

export function ShareRow({ billId, share }: { billId: string; share: Bill['shares'][number] }) {
  const [currentShare, setCurrentShare] = useState(share)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const paymentKey = useRef<string | null>(null)
  const request = useRef<AbortController | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  async function pay() {
    if (request.current || currentShare.paidAt !== null) return

    const controller = new AbortController()
    request.current = controller
    setPending(true)
    setError(null)

    try {
      // Reuse the key after failures: a timed-out request may already have paid the share.
      paymentKey.current ??= crypto.randomUUID()
      const paid = await payShare(billId, share.id, paymentKey.current, controller.signal)
      if (!controller.signal.aborted) {
        setCurrentShare({ ...share, ...paid })
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted) setError(errorMessage(error))
    } finally {
      request.current = null
      if (!controller.signal.aborted) setPending(false)
    }
  }

  return (
    <tr className="border-b-2 border-neutral-200 last:border-b-0">
      <th scope="row" className="max-w-64 px-5 py-5 font-bold wrap-anywhere sm:px-6">
        {currentShare.memberName}
      </th>
      <td className="px-4 py-5 font-mono text-xs whitespace-nowrap tabular-nums">
        {currentShare.amountCents} cents
      </td>
      <td aria-live="polite" className="px-4 py-5">
        <span className={`status-badge ${currentShare.paidAt === null ? 'bg-do' : 'bg-go'}`}>
          <span aria-hidden="true" className="size-1.5 bg-ink" />
          {currentShare.paidAt === null ? 'Unpaid' : 'Paid'}
        </span>
      </td>
      <td className="px-5 py-4 text-right sm:px-6">
        {currentShare.paidAt === null && (
          <button
            type="button"
            className="button min-w-24 enabled:bg-co"
            disabled={pending}
            onClick={() => void pay()}
          >
            {pending ? 'Paying…' : error ? 'Retry payment' : 'Pay'}
            <Icon name="arrow" />
          </button>
        )}
        {error && (
          <p
            role="alert"
            className="mt-3 ml-auto max-w-64 text-xs leading-relaxed font-semibold wrap-anywhere text-red-800"
          >
            {error}
          </p>
        )}
      </td>
    </tr>
  )
}
