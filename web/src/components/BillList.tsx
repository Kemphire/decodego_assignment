import type { Bill } from '../api'
import { BillCard } from './BillCard'

type BillListProps = {
  homeName: string
  bills: Bill[]
  onReload: () => void
}

export function BillList({ homeName, bills, onReload }: BillListProps) {
  return (
    <>
      <h2>Home: {homeName}</h2>
      <button type="button" onClick={onReload}>
        Reload bills
      </button>
      {bills.length === 0 && <p>No bills for this home.</p>}
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </>
  )
}
