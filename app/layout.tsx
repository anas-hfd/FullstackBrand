import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import AIAssistant from '@/components/AIAssistant'
import Footer from '@/components/Footer'
import CursorLight from '@/components/CursorLight'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const SITE_URL = 'https://www.fullstackbrand.co'
const SITE_NAME = 'FullstackBrand'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fullstack Brand | Web Development, UI/UX & Digital Solutions',
    template: '%s | FullstackBrand',
  },
  description:
    'FullstackBrand is an AI-powered full-stack web development agency delivering UI/UX design, AI automation, branding & digital marketing. Build your intelligent digital ecosystem today.',
  keywords: [
    'web development agency',
    'fullstack web solutions',
    'UI/UX design agency',
    'AI automation agency',
    'digital marketing agency',
    'brand identity design',
    'Next.js web development',
    'AI agents integration',
    'SaaS development',
    'FullstackBrand',
  ],
  authors: [{ name: 'FullstackBrand', url: SITE_URL }],
  creator: 'FullstackBrand',
  publisher: 'FullstackBrand',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logos/Logomark.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logos/Logomark.png',
  },
  openGraph: {
    title: 'Fullstack Brand | Web Development, UI/UX & Digital Solutions',
    description:
      'From futuristic web experiences to autonomous AI agents — FullstackBrand engineers the digital ecosystem your business needs to scale without limits.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand — We Build Intelligent Brands',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fullstack Brand | Web Development, UI/UX & Digital Solutions',
    description:
      'AI-powered full-stack agency: web development, UI/UX design, AI automation & digital marketing. Engineer your brand without limits.',
    images: ['/og-image.png'],
    site: '@fullstackbrand',
    creator: '@fullstackbrand',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logos/Logomark.png`,
        width: 200,
        height: 200,
      },
      description:
        'FullstackBrand is an AI-powered full-stack digital agency specializing in web development, UI/UX design, AI automation, branding, and digital marketing.',
      foundingDate: '2026',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'contact@fullstackbrand.co',
        telephone: '+1-945-997-2019',
        availableLanguage: 'English',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1309 Coffeen Avenue STE 1200',
        addressLocality: 'Sheridan',
        addressRegion: 'WY',
        postalCode: '82801',
        addressCountry: 'US',
      },
      sameAs: [
        'https://www.instagram.com/fullstackbrand_agency',
        'https://www.threads.com/@fullstackbrand_agency',
        'https://web.facebook.com/FullstackBrand',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: 'We Build Intelligent Brands — AI-Powered Full-Stack Digital Agency',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/og-image.png`,
      description:
        'Full-stack digital agency offering web development, UI/UX design, AI automation, branding, and digital marketing services.',
      areaServed: 'Worldwide',
      priceRange: '$1,000 - $15,000+',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'FullstackBrand Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Design & Visual Identity' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing & Brand Strategy' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development & SaaS Platforms' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automation & Agent Integration' } },
        ],
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/Logomark.png" />

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
