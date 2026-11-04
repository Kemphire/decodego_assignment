import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 border-2 border-ink bg-do px-4 py-3 text-sm font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <header className="border-b-4 border-ink bg-paper">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="flex border-2 border-ink text-xl font-black">
              <span className="grid size-8 place-items-center border-r-2 border-ink bg-do sm:size-9">
                B
              </span>
              <span className="grid size-8 place-items-center border-r-2 border-ink bg-co sm:size-9">
                I
              </span>
              <span className="grid size-8 place-items-center border-r-2 border-ink bg-de sm:size-9">
                L
              </span>
              <span className="grid size-8 place-items-center bg-go sm:size-9">L</span>
            </div>
            <span className="text-xs leading-tight font-black tracking-wider uppercase">
              Bill
              <br />
              Splitter
            </span>
          </div>
          <p className="eyebrow hidden items-center gap-2 sm:flex">
            <span aria-hidden="true" className="size-2.5 border-2 border-ink bg-go" />
            Shared home. Fair share.
          </p>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 pt-10 pb-16 sm:px-8 sm:pt-14">
        <div className="mb-10 flex items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-4 inline-block border-2 border-ink bg-ink px-3 py-1.5 text-paper">
              Less chasing. More living.
            </p>
            <h1 className="text-5xl leading-none font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Bill Splitter<span className="text-co">.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
              One home. Every bill. Everyone’s share.
              <br className="hidden sm:block" /> A little clarity for living together.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="hidden w-56 shrink-0 rotate-3 border-4 border-ink bg-do shadow-brutal md:block"
          >
            <div className="eyebrow flex items-center justify-between border-b-2 border-ink px-4 py-2">
              The house rule
              <Icon name="check" />
            </div>
            <p className="px-4 py-5 text-3xl leading-none font-black tracking-tight uppercase">
              Fair shares.
              <br />
              Zero drama.
            </p>
          </div>
        </div>

        {children}
      </main>

      <footer className="border-t-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <p className="eyebrow text-neutral-600">Good homes run on fair shares.</p>
          <div aria-hidden="true" className="flex border-2 border-ink">
            <span className="h-3 w-6 border-r-2 border-ink bg-do" />
            <span className="h-3 w-6 border-r-2 border-ink bg-co" />
            <span className="h-3 w-6 border-r-2 border-ink bg-de" />
            <span className="h-3 w-6 bg-go" />
          </div>
        </div>
      </footer>
    </div>
  )
}
