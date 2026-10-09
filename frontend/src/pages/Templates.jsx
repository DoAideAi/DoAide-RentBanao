import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { STATE_TEMPLATES } from './templates/stateData'

export default function Templates() {
  return (
    <>
      <Helmet>
        <title>Rent Agreement Templates for All Indian States | RentBanao</title>
        <meta name="description" content="Free rent agreement templates for Maharashtra, Karnataka, Delhi, Tamil Nadu, and all Indian states. Download state-specific rental agreement formats." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Rent Agreement Templates by State</h1>
        <p className="text-brand-muted mb-8">
          Choose your state to see a customized rent agreement template with correct stamp duty and
          registration requirements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATE_TEMPLATES.map(state => (
            <Link
              key={state.slug}
              to={`/templates/${state.slug}`}
              className="bg-brand-card border border-brand-border rounded-xl p-5 hover:border-brand-primary transition-colors group"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors mb-1">
                {state.name}
              </h2>
              <p className="text-sm text-brand-muted mb-3">{state.shortDesc}</p>
              <div className="flex items-center gap-3 text-xs text-brand-muted">
                <span className={`px-2 py-0.5 rounded ${state.eStamp ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {state.eStamp ? 'E-Stamp' : 'Physical Stamp'}
                </span>
                <span className={`px-2 py-0.5 rounded ${state.registrationRequired ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-500'}`}>
                  {state.registrationRequired ? 'Reg. Required' : 'Reg. Optional'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
