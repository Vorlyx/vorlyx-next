'use client'

import { Providers } from './providers'
// ... maybe other providers

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}