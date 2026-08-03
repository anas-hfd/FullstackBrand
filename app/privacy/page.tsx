// FullstackBrand Privacy Policy
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Lock, Eye, Cpu, Database, UserCheck, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | FullstackBrand',
  description: 'Learn how FullstackBrand collects, protects, and handles user data, AI workflows, and client security.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 2, 2026'

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
          <ShieldCheck className="w-6 h-6 text-brand-light dark:text-brand-dark" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          At FullstackBrand, transparency and data integrity are paramount. This document details how we collect, process, safeguard, and govern personal information and corporate data across our agency services, AI automation pipelines, and web applications.
        </p>
        <div className="mt-6 text-xs font-mono text-slate-400">
          Last Updated: {lastUpdated} · Version 2.4
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
        
        {/* Section 1 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          </div>
          <p>
            When you interact with FullstackBrand — through our contact forms, project configurator, direct emails, or client portals — we collect information essential to delivering high-caliber engineering and branding services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong className="text-slate-900 dark:text-white">Identity & Contact Data:</strong> Full name, corporate email address, phone number, company name, and job position.</li>
            <li><strong className="text-slate-900 dark:text-white">Project Inquiries & Specs:</strong> Budget ranges, delivery timelines, feature specifications, brand assets, and custom requirements.</li>
            <li><strong className="text-slate-900 dark:text-white">Technical Analytics:</strong> Anonymized IP addresses, device browser types, operating systems, session interaction data, and referrer URLs collected via telemetry.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
          </div>
          <p>
            We process personal and corporate data strictly for legitimate operational purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li>Formulating technical proposals, scope-of-work agreements, and cost estimates.</li>
            <li>Executing digital agency services including branding, web application engineering, and custom AI deployments.</li>
            <li>Communicating project updates, milestone demos, and ongoing maintenance reports.</li>
            <li>Improving web performance, accessibility, and user experience telemetry.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-light dark:border-brand-dark">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Artificial Intelligence & Data Isolation</h2>
          </div>
          <p>
            FullstackBrand specializes in autonomous AI agents and workflow automation. We maintain strict protocols regarding AI data hygiene:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong className="text-slate-900 dark:text-white">Zero Public Model Training:</strong> Proprietary client data, source code, and trade secrets processed by our AI pipelines are NEVER fed into public base models.</li>
            <li><strong className="text-slate-900 dark:text-white">Isolated Tenant Context:</strong> Vector databases, RAG embeddings, and LLM sessions deployed for your business operate within isolated enterprise sandboxes.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Data Security & Encryption</h2>
          </div>
          <p>
            We implement enterprise-grade technical and organizational safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li>All web communications and API endpoints are encrypted in transit via TLS 1.3.</li>
            <li>Restricted database access backed by role-based access control (RBAC) and multi-factor authentication (MFA).</li>
            <li>Regular security audits, dependency vulnerability scans, and secure code reviews.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="glass p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-brand-light dark:text-brand-dark flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Your Privacy Rights (GDPR & CCPA)</h2>
          </div>
          <p>
            Regardless of geographical location, all users and clients enjoy full rights over their personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong className="text-slate-900 dark:text-white">Right to Access:</strong> Request a full export of any personal data stored in our systems.</li>
            <li><strong className="text-slate-900 dark:text-white">Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the permanent deletion of your inquiry records and communication logs.</li>
            <li><strong className="text-slate-900 dark:text-white">Right to Rectification:</strong> Request corrections to any outdated or inaccurate information.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="glass p-8 rounded-3xl space-y-4 text-center">
          <Mail className="w-8 h-8 text-brand-light dark:text-brand-dark mx-auto mb-2" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Questions & Privacy Requests</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            To exercise your privacy rights or inquire about our data security practices, please contact our Data Officer:
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
