import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { STATE_TEMPLATES } from './templates/stateData'

export default function StateTemplate() {
  const { stateSlug } = useParams()
  const state = STATE_TEMPLATES.find(s => s.slug === stateSlug)

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">State Not Found</h1>
        <p className="text-brand-muted mb-6">We don't have a template for this state yet.</p>
        <Link to="/templates" className="text-brand-primary hover:underline">View All Templates</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{state.title} | RentBanao</title>
        <meta name="description" content={state.metaDesc} />
        <link rel="canonical" href={`https://rent.doaide.com/templates/${state.slug}`} />
        <meta property="og:title" content={`${state.title} | RentBanao`} />
        <meta property="og:description" content={state.metaDesc} />
        <meta property="og:url" content={`https://rent.doaide.com/templates/${state.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": state.title,
          "description": state.metaDesc,
          "author": { "@type": "Organization", "name": "DoAide" },
          "url": `https://rent.doaide.com/templates/${state.slug}`,
        })}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-brand-muted mb-6">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/templates" className="hover:text-brand-primary">Templates</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{state.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{state.title}</h1>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className={`px-3 py-1 rounded-lg text-sm ${state.eStamp ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
            {state.eStamp ? 'E-Stamp Available' : 'Physical Stamp Only'}
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm ${state.registrationRequired ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
            {state.registrationRequired ? 'Registration Required (>11 months)' : 'Registration Optional (≤11 months)'}
          </span>
        </div>

        <div className="bg-brand-card border border-brand-primary/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Stamp Duty</h2>
          <p className="text-2xl font-bold text-brand-primary">{state.stampDutyInfo}</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Key Points for {state.name}</h2>
          <ul className="space-y-3">
            {state.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-brand-primary mt-0.5">&#10003;</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {state.faq.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">FAQs — {state.name} Rent Agreement</h2>
            <div className="space-y-3">
              {state.faq.map((f, i) => (
                <details key={i} className="bg-brand-card border border-brand-border rounded-lg group">
                  <summary className="px-5 py-3 cursor-pointer text-white font-medium hover:text-brand-primary transition-colors list-none flex justify-between items-center">
                    {f.q}
                    <svg className="w-4 h-4 text-brand-muted group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-brand-muted">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/generator?state=${state.stateKey}`}
            className="flex-1 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-lg transition-colors text-center text-lg"
          >
            Generate {state.name} Rent Agreement
          </Link>
          <Link
            to="/stamp-duty"
            className="px-6 py-3 bg-brand-card border border-brand-border hover:border-brand-primary text-white font-medium rounded-lg transition-colors text-center"
          >
            Calculate Stamp Duty
          </Link>
        </div>
      </div>
    </>
  )
}
