import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ClientProviders from './client-providers'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  metadataBase: new URL('https://www.vorlyx.com'),
  title: {
    default: 'Vorlyx – Creative Strategists',
    template: '%s | Vorlyx',
  },
  description:
    'Vorlyx is a creative strategy agency crafting iconic brands, digital experiences, and unforgettable moves for ambitious clients worldwide.',
  keywords: [
    'Vorlyx',
    'creative agency',
    'brand strategy',
    'UX/UI design',
    'web design',
    'digital agency',
    'creative strategists',
    'brand identity',
    'creative direction',
  ],
  authors: [{ name: 'Vorlyx' }],
  creator: 'Vorlyx',
  publisher: 'Vorlyx',
  icons: {
    icon: '/Vorlyx.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vorlyx.com',
    siteName: 'Vorlyx',
    title: 'Vorlyx – Creative Strategists',
    description:
      'Vorlyx is a creative strategy agency crafting iconic brands, digital experiences, and unforgettable moves for ambitious clients worldwide.',
    images: [
      {
        url: '/og/Home_og.png',
        width: 1200,
        height: 630,
        alt: 'Vorlyx – Creative Strategists',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vorlyx – Creative Strategists',
    description:
      'Vorlyx is a creative strategy agency crafting iconic brands, digital experiences, and unforgettable moves for ambitious clients worldwide.',
    images: ['/og/Home_og.png'],
    creator: '@vorlyx',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.vorlyx.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lato.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="font-lato antialiased bg-black text-vorlyx-black overflow-x-hidden">
  <ClientProviders>{children}</ClientProviders>
  <Analytics />
  <SpeedInsights />
</body>
    </html>
  )
}