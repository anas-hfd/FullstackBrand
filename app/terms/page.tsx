// FullstackBrand Terms of Service
import Link from 'next/link'
import { FileText, ArrowLeft, CheckCircle2, Shield, Scale, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | FullstackBrand',
  description: 'Review the legal terms, service agreements, intellectual property rights, and SLA standards governing FullstackBrand services.',
}

export default function TermsOfServicePage() {
  const effectiveDate = 'August 2, 2026'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-brand-light dark:hover:text-brand-dark transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Header */}
      <div className="glass p-8 md:p-12 rounded-3xl mb-12 border border-brand-light/30 dark:border-brand-dark/30">
        <div className="w-12 h-12 rounded-2xl bg-brand-light/10 dark:bg-brand-dark/15 flex items-center justify-center mb-6">
          <FileText className="w-6 h-6 text-brand-light dark:text-brand-dark" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          These Terms of Service govern the engagement between Fullstack Brand LLC (&quot;FullstackBrand&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) and client entities or individuals (&quot;Client&quot;, &quot;you&quot;). By accessing our website, commissioning services, or interacting with our digital ecosystem, you agree to these legal conditions.
        </p>
        <div className="mt-6 text-xs font-mono text-slate-400">
          Effective Date: {effectiveDate} · Document Ref: FSB-TOS-2026
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">

        {/* Section 1 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Scope of Services</h2>
          </div>
          <p>
            FullstackBrand provides specialized digital agency and software development services structured under four primary pillars:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong className="text-slate-900 dark:text-white">Brand Design & Visual Identity:</strong> Brand visual & motion identity, visual systems, UI/UX design, and dashboard design.</li>
            <li><strong className="text-slate-900 dark:text-white">Digital Marketing & Brand Strategy:</strong> Positioning strategy, SEO, content architecture, and paid performance marketing.</li>
            <li><strong className="text-slate-900 dark:text-white">Web Development:</strong> Custom web applications, SaaS platforms, e-commerce systems, and mobile applications.</li>
            <li><strong className="text-slate-900 dark:text-white">AI Automation:</strong> Workflow automation, autonomous AI agent integration, chatbots, and custom LLM products.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-light dark:border-brand-dark">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Intellectual Property & Code Ownership</h2>
          </div>
          <p>
            We believe in complete client ownership upon project delivery:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong className="text-slate-900 dark:text-white">Deliverable Transfer:</strong> Upon full payment of all agreed invoice fees, all custom source code, brand graphics, UI design assets, and database schemas created specifically for the Client transfer 100% to the Client.</li>
            <li><strong className="text-slate-900 dark:text-white">Pre-existing Frameworks:</strong> Open-source packages, third-party libraries, and proprietary internal developer tooling used by FullstackBrand remain licensed under their respective open-source or commercial licenses.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Payment Terms, Milestones & Retainers</h2>
          </div>
          <p>
            Engagements are billed according to executed Statement of Work (SOW) documents:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li>Fixed-price projects are structured around milestone deliverables (e.g. 50% deposit / 50% completion or 33/33/34 phased sprints).</li>
            <li>Ongoing monthly retainers (AI Maintenance, Growth Marketing, DevOps) are billed on the 1st of each service calendar month.</li>
            <li>Invoices are due within 14 calendar days of issuance unless explicitly negotiated otherwise.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Confidentiality & Non-Disclosure</h2>
          </div>
          <p>
            Both parties agree to treat all business information, technical code, commercial strategies, and customer data shared during the project as strictly confidential. Neither party shall disclose confidential materials to third parties without prior written consent.
          </p>
        </section>

        {/* Section 5 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Warranties & Limitation of Liability</h2>
          </div>
          <p>
            FullstackBrand warrants that all software code and design deliverables are built in a professional, workmanlike manner adhering to modern web security and engineering standards.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            In no event shall FullstackBrand LLC be liable for indirect, incidental, special, or consequential damages (including loss of profits, data, or business interruption) arising out of or related to third-party API outages or client server misconfigurations. Maximum total aggregate liability shall not exceed the fees paid by the Client to FullstackBrand in the preceding three (3) months.
          </p>
        </section>

        {/* Section 6 */}
        <section className="glass p-8 rounded-3xl space-y-4 text-center">
          <HelpCircle className="w-8 h-8 text-brand-light dark:text-brand-dark mx-auto mb-2" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Governing Law & Legal Inquiries</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            These terms are governed by the laws of the State of Wyoming, USA. For contract questions or formal legal notices, contact our team:
          </p>
          <a
            href="mailto:contact@fullstackbrand.co"
            className="inline-block font-bold text-brand-light dark:text-brand-dark hover:underline text-lg"
          >
            contact@fullstackbrand.co
          </a>
        </section>

      </div>
    </div>
  )
}
