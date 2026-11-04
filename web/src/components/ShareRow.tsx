import { useEffect, useRef, useState } from 'react'
import { type Bill, payShare } from '../api'
import { errorMessage } from '../utils/errorMessage'

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
    <tr>
      <th scope="row">{currentShare.memberName}</th>
      <td>{currentShare.amountCents} cents</td>
      <td aria-live="polite">{currentShare.paidAt === null ? 'Unpaid' : 'Paid'}</td>
      <td>
        {currentShare.paidAt === null && (
          <button type="button" disabled={pending} onClick={() => void pay()}>
            {pending ? 'Paying…' : error ? 'Retry payment' : 'Pay'}
          </button>
        )}
        {error && <p role="alert">{error}</p>}
      </td>
    </tr>
  )
}
