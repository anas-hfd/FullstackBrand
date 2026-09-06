import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/navbar/Navbar'
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
    default: 'FullstackBrand | Applied AI Engineering · AI Lab & Commercial Studio',
    template: '%s | FullstackBrand',
  },
  description:
    'FullstackBrand is an applied AI engineering company with an integrated research and commercialization model. The AI Lab develops proprietary AI infrastructure — deterministic multi-agent systems, sovereign pipelines, generative toolsets. The Studio deploys them commercially through SaaS engineering, enterprise integration, and brand engineering.',
  keywords: [
    'brand design studio',
    'visual identity design',
    'brand systems studio',
    'AI automation systems',
    'web engineering studio',
    'digital growth systems',
    'full branding ecosystem',
    'brand strategy',
    'AI agents integration',
    'FullstackBrand',
    'UI/UX design studio',
    'growth systems',
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
    icon: '/logos/Logomark.png',
    shortcut: '/logos/Logomark.png',
    apple: '/logos/Logomark.png',
  },
  openGraph: {
    title: 'Fullstack Brand | Creative Brand Experience · AI Technology Studio',
    description:
      'Your brand deserves more than a logo. FullstackBrand builds complete brand ecosystems — bold visual identities, AI automation, stunning web experiences & results-driven digital systems.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand — Creative Brand & AI Technology Studio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fullstack Brand | Creative Brand Experience · AI Technology Studio',
    description:
      'Bold branding. Intelligent automation. High-performance web. Growth systems. FullstackBrand is your full branding ecosystem partner.',
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
        'FullstackBrand is an applied AI engineering company with an integrated research and commercialization model. The AI Lab (R\u0026D, proprietary IP, generative systems) and the Studio (commercial deployment, SaaS engineering, brand engineering) operate as two coordinated functions of the same company.',
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
        'https://www.linkedin.com/company/fullstackbrand/',
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
      description: 'Fullstack Brand | Creative Brand Experience · AI Technology Studio — bold visual identities, AI automation, high-performance web & results-driven systems. One partner. Infinite impact.',
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
        'Creative technology studio offering web engineering, UI/UX design, AI automation, branding, and digital growth systems.',
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
        className={`${inter.className} bg-[#bfbfbf] text-zinc-900 dark:bg-[#1a1a1a] dark:text-zinc-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CursorLight />
          <Navbar />
          <main className="relative min-h-screen overflow-hidden">
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
