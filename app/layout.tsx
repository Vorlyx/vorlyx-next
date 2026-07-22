import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ClientProviders from './client-providers'

// Load local Lato font files with all required weights
const lato = localFont({
  src: [
    {
      path: './fonts/Lato-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/Lato-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Lato-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Lato-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Lato-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-lato',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vorlyx.com'),
  title: {
    default: 'Vorlyx',
    template: '%s | Vorlyx', // This makes page titles look like: "Services | Vorlyx"
  },
  icons: {
    icon: '/Vorlyx.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lato.variable} scroll-smooth`}>
      <body className="font-lato antialiased bg-black text-vorlyx-black overflow-x-hidden">
        {/* We no longer use <DefaultSeo/> in Option A */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
