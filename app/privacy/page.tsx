// FullstackBrand Privacy Policy
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Lock, Eye, Cpu, Database, UserCheck, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | FullstackBrand',
  description: 'Learn how FullstackBrand collects, protects, and handles user data, AI workflows, and client security across our Agency and AI Lab.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 28, 2026'

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
          <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
          At FullstackBrand, transparency and data integrity are fundamental across our entire ecosystem. This document details how we collect, process, safeguard, and govern personal information and corporate data across our AI Research Lab, agency services, workflow automation pipelines, and web applications.
        </p>
        <div className="mt-6 text-xs font-mono text-zinc-400 dark:text-zinc-500">
          Last Updated: {lastUpdated} · Version 3.0
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
        
        {/* Section 1 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          </div>
          <p>
            When you interact with FullstackBrand — via our agency contact forms, AI Lab research portals, project configurators, newsletter subscriptions, or API sandboxes — we collect necessary operational data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li><strong className="text-zinc-900 dark:text-white">Identity &amp; Contact Data:</strong> Full name, corporate or personal email address, phone number, company name, and job title.</li>
            <li><strong className="text-zinc-900 dark:text-white">Project &amp; Research Inquiries:</strong> Technical specifications, budget scopes, timeline targets, feature requirements, and research collaboration requests.</li>
            <li><strong className="text-zinc-900 dark:text-white">Technical Analytics:</strong> Anonymized IP addresses, browser runtime environments, interaction telemetry, and operating system metrics used exclusively for site optimization.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. How We Use Your Data</h2>
          </div>
          <p>
            We process data strictly for legitimate operational, research, and client-delivery purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li>Delivering bespoke digital agency services including brand identity, custom software engineering, and AI automation.</li>
            <li>Sending research notifications, technical whitepapers, and software release updates when requested.</li>
            <li>Executing technical proposals, scope-of-work agreements, and scheduled milestone demos.</li>
            <li>Ensuring high performance, security validation, and accessibility telemetry across our web platforms.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10 border-l-4 border-l-zinc-900 dark:border-l-white">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. Artificial Intelligence &amp; Data Sovereignty</h2>
          </div>
          <p>
            Both our AI Research Lab and Agency Studio adhere to strict data sovereignty protocols:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li><strong className="text-zinc-900 dark:text-white">Zero Public Model Training:</strong> Proprietary client data, codebases, and corporate trade secrets are NEVER used to train public base models.</li>
            <li><strong className="text-zinc-900 dark:text-white">Isolated Tenant Contexts:</strong> Private vector embeddings, RAG indexes, and LLM sessions run in segregated enterprise sandboxes with zero cross-tenant contamination.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Data Security &amp; Encryption Standards</h2>
          </div>
          <p>
            We deploy multi-layered organizational and technical safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li>All web communications and API endpoints are encrypted in transit via modern TLS 1.3 standards.</li>
            <li>Role-based access control (RBAC), multi-factor authentication (MFA), and strict key rotation policies.</li>
            <li>Continuous vulnerability audits, dependency analysis, and secure containerization.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="glass p-8 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">5. Your Privacy Rights (GDPR, CCPA &amp; Global)</h2>
          </div>
          <p>
            All users, research participants, and agency clients possess comprehensive data rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
            <li><strong className="text-zinc-900 dark:text-white">Right to Access:</strong> Request a complete export of personal data retained in our systems.</li>
            <li><strong className="text-zinc-900 dark:text-white">Right to Erasure:</strong> Request the full deletion of your contact records, inquiry logs, and research subscriptions.</li>
            <li><strong className="text-zinc-900 dark:text-white">Right to Rectification:</strong> Request prompt correction of inaccurate or outdated information.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="glass p-8 rounded-3xl space-y-4 text-center border border-zinc-200/80 dark:border-white/10">
          <Mail className="w-8 h-8 text-zinc-900 dark:text-white mx-auto mb-2" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Questions &amp; Privacy Requests</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
            To exercise your privacy rights or discuss our data architecture, contact our team:
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
