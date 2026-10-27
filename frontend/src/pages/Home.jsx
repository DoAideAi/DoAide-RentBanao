import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const FEATURES = [
  {
    title: 'Rent Agreement Generator',
    desc: 'Fill a simple form and download a professionally drafted rent agreement as PDF. No login needed.',
    icon: '📄',
    link: '/generator',
    cta: 'Generate Now',
  },
  {
    title: 'Stamp Duty Calculator',
    desc: 'Calculate stamp duty and registration fees for your state. Compare rates across all 28 states and 8 UTs.',
    icon: '🧮',
    link: '/stamp-duty',
    cta: 'Calculate',
  },
  {
    title: 'State Templates',
    desc: 'Pre-built agreement templates customized for Maharashtra, Karnataka, Delhi, Tamil Nadu, and more.',
    icon: '📋',
    link: '/templates',
    cta: 'Browse Templates',
  },
]

const STATES_HIGHLIGHT = [
  'Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan',
  'West Bengal', 'Kerala',
]

export default function Home() {
  return (
    <>
      <Helmet>
        <title>RentBanao - Free Rent Agreement Generator for India</title>
        <meta name="description" content="Generate legally valid rent agreements for all Indian states. Free, no login required. Includes stamp duty calculator and state-specific templates." />
        <link rel="canonical" href="https://rent.doaide.com/" />
        <meta property="og:title" content="RentBanao - Free Rent Agreement Generator for India" />
        <meta property="og:description" content="Generate legally valid rent agreements for all Indian states. Free, no login required. Includes stamp duty calculator and state-specific templates." />
        <meta property="og:url" content="https://rent.doaide.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/5" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm mb-6">
              100% Free &middot; No Login Required
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Rent Agreement
              <span className="text-brand-primary"> Generator</span>
              <br />for India
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Create legally valid rent agreements in minutes. Supports all 28 states and 8 Union Territories
              with correct stamp duty calculations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/generator"
                className="px-8 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Generate Rent Agreement
              </Link>
              <Link
                to="/stamp-duty"
                className="px-8 py-3 bg-brand-card border border-brand-border hover:border-brand-primary text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Calculate Stamp Duty
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
          Everything You Need for Your Rent Agreement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Link
              key={f.title}
              to={f.link}
              className="bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-primary transition-colors group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-brand-muted mb-4">{f.desc}</p>
              <span className="text-brand-primary text-sm font-medium">{f.cta} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
          How It Works
        </h2>
        <p className="text-center text-brand-muted mb-12 max-w-xl mx-auto">
          Generate your rent agreement in 3 simple steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Fill the Form', desc: 'Enter landlord, tenant, property details, and rent terms.' },
            { step: '2', title: 'Review & Customize', desc: 'Preview your agreement with stamp duty auto-calculated for your state.' },
            { step: '3', title: 'Download PDF', desc: 'Download the professionally formatted agreement. Print on stamp paper.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-brand-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-card border-y border-brand-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Available for All Indian States
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {STATES_HIGHLIGHT.map(s => (
              <span key={s} className="px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-gray-300">
                {s}
              </span>
            ))}
            <Link to="/templates" className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-sm text-brand-primary hover:bg-brand-primary/20 transition-colors">
              + All 36 States/UTs
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is this rent agreement legally valid?',
              a: 'The agreement generated follows standard legal clauses used in Indian rent agreements. For it to be legally binding, you need to print it on stamp paper of the appropriate value for your state and get it registered (if required for your lease duration).',
            },
            {
              q: 'Do I need to register the agreement?',
              a: 'Registration is mandatory for lease agreements longer than 11 months in most states. For 11-month agreements (the most common), registration is typically optional but recommended. Our stamp duty calculator shows registration requirements for your state.',
            },
            {
              q: 'What is stamp duty on rent agreements?',
              a: 'Stamp duty is a tax levied by state governments on legal documents. Each state has different stamp duty rates for rental agreements. Our calculator shows the exact amount for your state based on your rent and deposit.',
            },
            {
              q: 'Is this tool really free?',
              a: 'Yes, the core rent agreement generator and stamp duty calculator are completely free with no login required. We may add optional premium features in the future, but the basic tools will always remain free.',
            },
            {
              q: 'Can I use this for commercial lease agreements?',
              a: 'Yes, you can generate both residential and commercial lease agreements. Select "Commercial" as the property type and the agreement will include appropriate commercial clauses.',
            },
          ].map(faq => (
            <details key={faq.q} className="bg-brand-card border border-brand-border rounded-lg group">
              <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:text-brand-primary transition-colors list-none flex justify-between items-center">
                {faq.q}
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4 text-sm text-brand-muted">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
