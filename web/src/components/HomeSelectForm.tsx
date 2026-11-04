import type { Home } from '../api'
import { Icon } from './Icon'

type HomeSelectFormProps = {
  homes: Home[]
  homeId: string
  loading: boolean
  onHomeIdChange: (homeId: string) => void
  onSubmit: () => void
}

export function HomeSelectForm({
  homes,
  homeId,
  loading,
  onHomeIdChange,
  onSubmit,
}: HomeSelectFormProps) {
  return (
    <form
      className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="home-id" className="eyebrow mb-2 block">
          Home
        </label>
        <select
          id="home-id"
          className="min-h-12 w-full border-2 border-ink bg-canvas px-3 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:text-neutral-500"
          required
          disabled={homes.length === 0}
          value={homeId}
          onChange={(event) => onHomeIdChange(event.target.value)}
        >
          <option value="" disabled>
            {homes.length === 0 ? 'No homes available' : 'Select a home'}
          </option>
          {homes.map((home) => (
            <option key={home.id} value={home.id}>
              {home.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="button min-h-12 enabled:bg-co sm:min-w-44"
        disabled={!homeId || homes.length === 0 || loading}
      >
        Load bills
        <Icon name="arrow" />
      </button>
    </form>
  )
}
