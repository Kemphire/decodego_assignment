export interface Home {
  id: string
  name: string
}

export interface Share {
  id: string
  memberId: string
  amountCents: number
  paidAt: string | null
}

export interface Bill {
  id: string
  homeId: string
  title: string
  totalCents: number
  shares: (Share & { memberName: string })[]
}

async function request<T>(path: string, signal: AbortSignal, options?: RequestInit): Promise<T> {
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), 15000)

  try {
    const response = await fetch(path, {
      ...options,
      signal: AbortSignal.any([signal, timeout.signal]),
    })

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('This share was already paid. Reload bills to see its current status.')
      }
      const data = (await response.json().catch(() => null)) as { error: string } | null
      throw new Error(data?.error ?? `Request failed (${response.status}). Please try again.`)
    }

    return (await response.json()) as T
  } catch (error: unknown) {
    if (timeout.signal.aborted && !signal.aborted) {
      throw new Error('The request timed out. Please try again.')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export function getHomes(signal: AbortSignal): Promise<Home[]> {
  return request<Home[]>('/api/homes', signal)
}

export async function getBills(homeId: string, signal: AbortSignal): Promise<Bill[]> {
  const { bills } = await request<{ bills: Bill[] }>(
    `/api/homes/${encodeURIComponent(homeId)}/bills`,
    signal,
  )
  return bills
}

export function payShare(
  billId: string,
  shareId: string,
  key: string,
  signal: AbortSignal,
): Promise<Share> {
  return request<Share>(
    `/api/bills/${encodeURIComponent(billId)}/shares/${encodeURIComponent(shareId)}/pay`,
    signal,
    { method: 'POST', headers: { 'Idempotency-Key': key } },
  )
}
