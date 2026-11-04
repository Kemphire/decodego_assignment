import type { Bill } from '../api'
import { BillCard } from './BillCard'
import { Icon } from './Icon'

type BillListProps = {
  homeName: string
  bills: Bill[]
  onReload: () => void
}

export function BillList({ homeName, bills, onReload }: BillListProps) {
  return (
    <section aria-labelledby="bills-heading" className="mt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b-4 border-ink pb-5">
        <div className="min-w-0">
          <p className="eyebrow mb-2 text-neutral-600">02 / The breakdown</p>
          <h2 id="bills-heading" className="text-2xl font-black tracking-tight sm:text-3xl">
            Home: {homeName}
          </h2>
        </div>
        <button type="button" className="button bg-paper" onClick={onReload}>
          <Icon name="reload" />
          Reload bills
        </button>
      </div>
      {bills.length === 0 && (
        <div className="state-panel flex flex-col items-center gap-4 py-12 text-center">
          <div
            aria-hidden="true"
            className="grid size-12 place-items-center border-2 border-ink bg-go"
          >
            <Icon name="check" className="size-6" />
          </div>
          <p className="font-semibold">No bills for this home.</p>
        </div>
      )}
      <div className="grid min-w-0 gap-7">
        {bills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </div>
    </section>
  )
}
