import type { Home } from '../api'

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
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor="home-id">Home</label>{' '}
      <select
        id="home-id"
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
      </select>{' '}
      <button type="submit" disabled={!homeId || homes.length === 0 || loading}>
        Load bills
      </button>
    </form>
  )
}
