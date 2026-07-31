import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import AIAssistant from '@/components/AIAssistant'
import Footer from '@/components/Footer'
import CursorLight from '@/components/CursorLight'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FullstackBrand | AI-Powered Full-Stack Digital Agency',
  description:
    'FullstackBrand engineers intelligent digital ecosystems — premium web development, AI automation, branding, and growth marketing for ambitious businesses.',
  icons: {
    icon: '/logos/logomark.png',
    apple: '/logos/logomark.png',
  },
  metadataBase: new URL('https://fullstackbrand.co'),
  openGraph: {
    title: 'FullstackBrand | AI-Powered Full-Stack Digital Agency',
    description:
      'From cutting-edge web experiences to autonomous AI agents — we build the digital ecosystem your business needs to scale without limits.',
    url: 'https://fullstackbrand.co',
    siteName: 'FullstackBrand',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logos/logomark.png" type="image/png" />
      </head>
      <body
        className={`${inter.className} bg-brand-offwhite dark:bg-brand-obsidian text-slate-900 dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CursorLight />
          <Navbar />
          <main className="relative min-h-screen overflow-hidden pt-24">
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
