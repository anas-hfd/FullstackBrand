// FullstackBrand Terms of Service
import Link from 'next/link'
import { FileText, ArrowLeft, CheckCircle2, Shield, Scale, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | FullstackBrand',
  description: 'Review the legal terms, service agreements, intellectual property rights, and SLA standards governing FullstackBrand services across our Agency and AI Lab.',
}

export default function TermsOfServicePage() {
  const effectiveDate = 'August 28, 2026'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back navigation buttons */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/agency"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Agency
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">·</span>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          AI Lab Home
        </Link>
      </div>

      {/* Header */}
      <div className="glass p-8 md:p-12 rounded-3xl mb-12 border border-zinc-200/80 dark:border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center mb-6">
          <FileText className="w-6 h-6 text-zinc-900 dark:text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
          These Terms of Service govern the engagement between FullstackBrand (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) and users or client entities (&quot;Client&quot;, &quot;User&quot;, &quot;you&quot;). By accessing our website, subscribing to AI Lab research updates, commissioning agency services, or deploying our software, you agree to these terms.
        </p>
        <div className="mt-6 text-xs font-mono text-zinc-400 dark:text-zinc-500">
          Effective Date: {effectiveDate} · Document Ref: FSB-TOS-2026-V3
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed">

        {/* Section 1 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Scope of Ecosystem Services</h2>
          </div>
          <p>
            FullstackBrand operates as a unified dual entity comprising creative engineering and applied intelligence:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li><strong className="text-zinc-900 dark:text-white">AI Research Lab:</strong> Exploration of frontier AI architectures, deterministic agent routing, synthetic asset generation (GlyphForge), open-source tooling, and technical publications.</li>
            <li><strong className="text-zinc-900 dark:text-white">Creative &amp; Digital Agency:</strong> Brand visual identity systems, bespoke web and SaaS platform engineering, workflow automation, and digital strategy.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10 border-l-4 border-l-zinc-900 dark:border-l-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. Intellectual Property &amp; Ownership</h2>
          </div>
          <p>
            We maintain transparent, client-centric intellectual property boundaries:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li><strong className="text-zinc-900 dark:text-white">Custom Client Deliverables:</strong> Upon final settlement of agreed project fees, all custom source code, brand graphics, UI assets, and bespoke schemas built exclusively for the Client transfer 100% to the Client.</li>
            <li><strong className="text-zinc-900 dark:text-white">AI Lab Research &amp; Tooling:</strong> Open-source repositories, foundational research frameworks, and shared platform primitives remain licensed under their declared open-source or commercial licenses.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. Commercial Terms &amp; Engagements</h2>
          </div>
          <p>
            Agency engagements are governed by custom Statements of Work (SOW):
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li>Fixed-price milestone agreements are executed in phased sprints (e.g. deposit / intermediate milestone / final release).</li>
            <li>Retainers (AI agent monitoring, infrastructure maintenance, continuous engineering) are billed on the first day of each service period.</li>
            <li>Standard invoice terms require payment within 14 calendar days from receipt.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Confidentiality &amp; Proprietary Integrity</h2>
          </div>
          <p>
            Both parties agree to treat all business information, technical code, architectural models, and client data as strictly confidential. Neither party shall disclose confidential materials to third parties without prior written consent.
          </p>
        </section>

        {/* Section 5 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">5. Warranties &amp; Limitation of Liability</h2>
          </div>
          <p>
            FullstackBrand warrants that all software code and design deliverables are developed in a professional manner adhering to industry-leading web security and engineering standards.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            To the maximum extent permitted by law, FullstackBrand shall not be liable for indirect, consequential, or exemplary damages resulting from third-party cloud outages, model API provider disruptions, or client-side infrastructure modifications. Maximum aggregate liability is limited to fees received in the preceding three (3) months.
          </p>
        </section>

        {/* Section 6 */}
        <section className="glass p-8 rounded-3xl space-y-4 text-center border border-zinc-200/80 dark:border-white/10">
          <HelpCircle className="w-8 h-8 text-zinc-900 dark:text-white mx-auto mb-2" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Governing Law &amp; Legal Notices</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
            These terms are governed by the laws of the State of Wyoming, USA. For contract inquiries or legal correspondence, contact our team:
          </p>
          <a
            href="mailto:contact@fullstackbrand.co"
            className="inline-block font-bold text-zinc-900 dark:text-white hover:underline text-lg"
          >
            contact@fullstackbrand.co
          </a>
        </section>

      </div>
    </div>
  )
}
