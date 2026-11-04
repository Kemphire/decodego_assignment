import type { Bill } from '../api'
import { Icon } from './Icon'
import { ShareRow } from './ShareRow'

export function BillCard({ bill }: { bill: Bill }) {
  return (
    <section className="min-w-0 border-4 border-ink bg-paper shadow-brutal">
      <div className="flex flex-col items-start gap-5 border-b-2 border-ink p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center border-2 border-ink bg-co"
          >
            <Icon name="receipt" className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="eyebrow mb-1 text-neutral-600">Household bill</p>
            <h3 className="text-xl leading-tight font-black tracking-tight sm:text-2xl">
              {bill.title}
            </h3>
          </div>
        </div>
        <div className="border-2 border-ink bg-do px-4 py-2">
          <p className="eyebrow mb-1">Total</p>
          <p className="font-mono text-xl font-bold tabular-nums">
            {bill.totalCents} <span className="text-xs font-medium">cents</span>
          </p>
        </div>
      </div>
      {bill.shares.length === 0 ? (
        <p className="px-5 py-8 text-sm text-neutral-600 sm:px-6">No shares for this bill.</p>
      ) : (
        <div>
          {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Allow keyboard users to scroll the table on narrow screens. */}
          <section aria-label={`Shares for ${bill.title}`} tabIndex={0} className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">Individual shares for {bill.title}</caption>
              <thead className="border-b-2 border-ink bg-neutral-100">
                <tr className="eyebrow">
                  <th scope="col" className="px-5 py-3 sm:px-6">
                    Member
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bill.shares.map((share) => (
                  <ShareRow key={share.id} billId={bill.id} share={share} />
                ))}
              </tbody>
            </table>
          </section>
          <p className="border-t-2 border-ink bg-canvas px-5 py-3 font-mono text-[10px] text-neutral-600 sm:hidden">
            Scroll sideways for payment actions →
          </p>
        </div>
      )}
    </section>
  )
}
