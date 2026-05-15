import type { PropsWithChildren } from 'react'

import { APP_NAME, APP_STATUS, APP_SUBTITLE } from '@/shared/config/app-info'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__brand">
          <span className="app-shell__eyebrow">Staffing Platform</span>
          <h1 className="app-shell__title">{APP_NAME}</h1>
          <p className="app-shell__subtitle">{APP_SUBTITLE}</p>
        </div>
        <span className="app-shell__status">{APP_STATUS}</span>
      </header>

      <main className="app-shell__content">{children}</main>
    </div>
  )
}
