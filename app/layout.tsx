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
    default: ' FullstackBrand| Brand Experience · AI-Powered Digital Agency',
    template: '%s | FullstackBrand',
  },
  description:
    'Your brand deserves more than a logo — FullstackBrand is a full branding ecosystem agency delivering bold visual identities, AI-powered automation, high-performance web development, and growth-driven digital marketing. One partner. Infinite impact.',
  keywords: [
    'branding agency',
    'visual identity design',
    'brand identity agency',
    'AI automation agency',
    'web development agency',
    'digital marketing agency',
    'full branding ecosystem',
    'brand strategy',
    'AI agents integration',
    'FullstackBrand',
    'UI/UX design agency',
    'growth marketing',
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
      { url: '/logos/Logomark.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logos/Logomark.png',
    apple: '/logos/Logomark.png',
  },
  openGraph: {
    title: 'Brand Experience · AI-Powered Digital Agency | FullstackBrand',
    description:
      'Your brand deserves more than a logo. FullstackBrand builds complete brand ecosystems — bold visual identities, AI automation, stunning web experiences & results-driven marketing.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand — Full Branding Ecosystem Agency',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Experience · AI-Powered Digital Agency | FullstackBrand',
    description:
      'Bold branding. Intelligent automation. High-performance web. Growth marketing. FullstackBrand is your full branding ecosystem partner.',
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
        'FullstackBrand is a full branding ecosystem agency specializing in visual identity design, AI automation, web development, and growth-driven digital marketing.',
      foundingDate: '2026',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'contact@fullstackbrand.co',
          telephone: '+1-945-997-2019',
          availableLanguage: 'English',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'Sales',
          telephone: '+1-945-997-2019',
          availableLanguage: 'English',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1309 Coffeen Avenue STE 1200',
        addressLocality: 'Sheridan',
        addressRegion: 'WY',
        postalCode: '82801',
        addressCountry: 'US',
      },
      telephone: '+1-945-997-2019',
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
        {/* Favicon — Logomark as primary for best search engine appearance */}
        <link rel="icon" href="/logos/Logomark.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logos/Logomark.png" />
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
