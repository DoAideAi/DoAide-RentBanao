import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchStates, calculateStampDuty, compareAllStates } from '../api'
import ShareButtons from '../components/ShareButtons'

export default function StampDuty() {
  const [states, setStates] = useState([])
  const [form, setForm] = useState({ state: '', monthly_rent: '', security_deposit: '', duration_months: 11 })
  const [result, setResult] = useState(null)
  const [comparison, setComparison] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStates().then(setStates).catch(() => {})
  }, [])

  async function handleCalculate(e) {
    e.preventDefault()
    if (!form.state || !form.monthly_rent) return
    setLoading(true)
    try {
      const data = await calculateStampDuty({
        state: form.state,
        monthly_rent: parseFloat(form.monthly_rent),
        security_deposit: parseFloat(form.security_deposit) || 0,
        duration_months: parseInt(form.duration_months),
      })
      setResult(data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompare() {
    if (comparison.length > 0) {
      setShowCompare(!showCompare)
      return
    }
    const data = await compareAllStates()
    setComparison(data)
    setShowCompare(true)
  }

  return (
    <>
      <Helmet>
        <title>Stamp Duty Calculator for Rent Agreements - All Indian States | RentBanao</title>
        <meta name="description" content="Calculate stamp duty and registration fees for rent agreements across all Indian states and UTs. Compare rates, check e-stamp availability." />
        <link rel="canonical" href="https://rent.doaide.com/stamp-duty" />
        <meta property="og:title" content="Stamp Duty Calculator for Rent Agreements - All Indian States | RentBanao" />
        <meta property="og:description" content="Calculate stamp duty and registration fees for rent agreements across all Indian states and UTs. Compare rates, check e-stamp availability." />
        <meta property="og:url" content="https://rent.doaide.com/stamp-duty" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stamp Duty Calculator</h1>
        <p className="text-brand-muted mb-8">Calculate stamp duty and registration fees for your rental agreement.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Enter Details</h2>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State / UT <span className="text-red-400">*</span></label>
                <select
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  required
                >
                  <option value="">Select State / UT</option>
                  {states.map(s => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Rent (₹) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  value={form.monthly_rent}
                  onChange={e => setForm(f => ({ ...f, monthly_rent: e.target.value }))}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  placeholder="e.g. 25000"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={form.security_deposit}
                  onChange={e => setForm(f => ({ ...f, security_deposit: e.target.value }))}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  placeholder="e.g. 100000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (months)</label>
                <select
                  value={form.duration_months}
                  onChange={e => setForm(f => ({ ...f, duration_months: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  {[6, 11, 12, 24, 36, 48, 60].map(m => (
                    <option key={m} value={m}>{m} months</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Calculating...' : 'Calculate Stamp Duty'}
              </button>
            </form>
          </div>

          <div>
            {result && !result.error && (
              <div className="bg-brand-card border border-brand-primary/30 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">Result — {result.state}</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-dark rounded-lg p-4">
                    <p className="text-sm text-brand-muted">Stamp Duty</p>
                    <p className="text-2xl font-bold text-brand-primary">₹{result.stamp_duty?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-brand-muted mt-1">{result.stamp_duty_rate}</p>
                  </div>
                  <div className="bg-brand-dark rounded-lg p-4">
                    <p className="text-sm text-brand-muted">Registration Fee</p>
                    <p className="text-2xl font-bold text-white">
                      {result.registration_required ? `₹${result.registration_fee?.toLocaleString('en-IN')}` : 'Not Required'}
                    </p>
                  </div>
                  <div className="bg-brand-dark rounded-lg p-4">
                    <p className="text-sm text-brand-muted">Total Cost</p>
                    <p className="text-2xl font-bold text-brand-secondary">₹{result.total_cost?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-brand-dark rounded-lg p-4">
                    <p className="text-sm text-brand-muted">E-Stamp</p>
                    <p className="text-2xl font-bold text-white">{result.e_stamp_available ? 'Available' : 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-brand-dark rounded-lg p-4">
                  <p className="text-sm text-brand-muted mb-1">Rent Summary</p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Annual Rent</span>
                      <span className="text-white">₹{result.annual_rent?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Rent ({form.duration_months} months)</span>
                      <span className="text-white">₹{result.total_rent?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {result.notes && (
                  <p className="text-xs text-brand-muted">{result.notes}</p>
                )}

                <ShareButtons
                  text={`Stamp duty for rent agreement in ${result.state}: ₹${result.stamp_duty?.toLocaleString('en-IN')} (${result.stamp_duty_rate}). Total cost incl. registration: ₹${result.total_cost?.toLocaleString('en-IN')}.`}
                />
              </div>
            )}

            {!result && (
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 text-center">
                <p className="text-3xl mb-4">🧮</p>
                <p className="text-brand-muted">Select a state and enter rent details to calculate stamp duty.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={handleCompare}
            className="px-6 py-2.5 bg-brand-card border border-brand-border hover:border-brand-primary text-white font-medium rounded-lg transition-colors"
          >
            {showCompare ? 'Hide Comparison' : 'Compare All States'}
          </button>

          {showCompare && comparison.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border">
                    <th className="text-left py-3 px-4 text-brand-muted font-medium">State / UT</th>
                    <th className="text-left py-3 px-4 text-brand-muted font-medium">Stamp Duty Rate</th>
                    <th className="text-center py-3 px-4 text-brand-muted font-medium">Registration</th>
                    <th className="text-center py-3 px-4 text-brand-muted font-medium">E-Stamp</th>
                    <th className="text-right py-3 px-4 text-brand-muted font-medium">Reg. Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(s => (
                    <tr key={s.key} className="border-b border-brand-border/50 hover:bg-brand-card/50">
                      <td className="py-3 px-4 text-white font-medium">{s.name}</td>
                      <td className="py-3 px-4 text-gray-300">{s.stamp_duty_rate}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${s.registration_required ? 'bg-red-400' : 'bg-green-400'}`} />
                        <span className="ml-2 text-gray-400">{s.registration_required ? 'Required' : 'Optional'}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={s.e_stamp_available ? 'text-green-400' : 'text-gray-600'}>{s.e_stamp_available ? 'Yes' : 'No'}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">₹{s.registration_fee?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
