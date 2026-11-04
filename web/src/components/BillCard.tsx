import type { Bill } from '../api'
import { ShareRow } from './ShareRow'

export function BillCard({ bill }: { bill: Bill }) {
  return (
    <section>
      <h3>{bill.title}</h3>
      <p>Total: {bill.totalCents} cents</p>
      {bill.shares.length === 0 ? (
        <p>No shares for this bill.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Member</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {bill.shares.map((share) => (
              <ShareRow key={share.id} billId={bill.id} share={share} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
