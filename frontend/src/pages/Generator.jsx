import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchStates, generateAgreementPdf, previewAgreement } from '../api'

const INITIAL_FORM = {
  landlord_name: '',
  landlord_father_name: '',
  landlord_address: '',
  landlord_aadhar: '',
  tenant_name: '',
  tenant_father_name: '',
  tenant_address: '',
  tenant_aadhar: '',
  property_address: '',
  property_type: 'Residential',
  furnishing: 'Unfurnished',
  monthly_rent: '',
  security_deposit: '',
  maintenance_charges: '',
  rent_increment_percent: '',
  start_date: new Date().toISOString().split('T')[0],
  duration_months: 11,
  state: '',
  city: '',
  notice_period_months: 1,
  lock_in_months: 0,
  purpose: 'Residential',
  additional_clauses: '',
  language: 'english',
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-brand-muted mt-1">{hint}</p>}
    </div>
  )
}

function Input({ type = 'text', ...props }) {
  return (
    <input
      type={type}
      className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
      {...props}
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
      {...props}
    >
      {children}
    </select>
  )
}

export default function Generator() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [states, setStates] = useState([])
  const [step, setStep] = useState(1)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStates().then(setStates).catch(() => {})
  }, [])

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const canProceed1 = form.landlord_name && form.landlord_address && form.tenant_name && form.tenant_address
  const canProceed2 = form.property_address && form.monthly_rent && form.state && form.start_date

  async function handlePreview() {
    setError('')
    setLoading(true)
    try {
      const data = {
        ...form,
        monthly_rent: parseFloat(form.monthly_rent) || 0,
        security_deposit: parseFloat(form.security_deposit) || 0,
        maintenance_charges: parseFloat(form.maintenance_charges) || 0,
        rent_increment_percent: parseFloat(form.rent_increment_percent) || 0,
        duration_months: parseInt(form.duration_months) || 11,
        notice_period_months: parseInt(form.notice_period_months) || 1,
        lock_in_months: parseInt(form.lock_in_months) || 0,
      }
      const result = await previewAgreement(data)
      setPreview(result)
      setStep(3)
    } catch {
      setError('Failed to generate preview. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    setError('')
    setLoading(true)
    try {
      const data = {
        ...form,
        monthly_rent: parseFloat(form.monthly_rent) || 0,
        security_deposit: parseFloat(form.security_deposit) || 0,
        maintenance_charges: parseFloat(form.maintenance_charges) || 0,
        rent_increment_percent: parseFloat(form.rent_increment_percent) || 0,
        duration_months: parseInt(form.duration_months) || 11,
        notice_period_months: parseInt(form.notice_period_months) || 1,
        lock_in_months: parseInt(form.lock_in_months) || 0,
      }
      const blob = await generateAgreementPdf(data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RentAgreement_${form.landlord_name.replace(/\s+/g, '_')}_${form.tenant_name.replace(/\s+/g, '_')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Rent Agreement Generator - RentBanao</title>
        <meta name="description" content="Generate a legally valid rent agreement for any Indian state. Fill a simple form and download your agreement as PDF. Free, no login required." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Rent Agreement Generator</h1>
        <p className="text-brand-muted mb-8">Fill the details below to generate your rent agreement. No login required.</p>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-brand-primary text-white' : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}>
                {s}
              </div>
              <span className={`text-sm hidden sm:inline ${step >= s ? 'text-white' : 'text-brand-muted'}`}>
                {s === 1 ? 'Parties' : s === 2 ? 'Property & Terms' : 'Review & Download'}
              </span>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-brand-primary' : 'bg-brand-border'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Landlord Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <Input value={form.landlord_name} onChange={e => update('landlord_name', e.target.value)} placeholder="e.g. Rajesh Kumar" />
                </Field>
                <Field label="Father's / Spouse's Name">
                  <Input value={form.landlord_father_name} onChange={e => update('landlord_father_name', e.target.value)} placeholder="S/o or D/o" />
                </Field>
                <Field label="Address" required>
                  <Input value={form.landlord_address} onChange={e => update('landlord_address', e.target.value)} placeholder="Current residential address" />
                </Field>
                <Field label="Aadhar Number" hint="Last 4 digits shown in agreement">
                  <Input value={form.landlord_aadhar} onChange={e => update('landlord_aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12-digit Aadhar number" />
                </Field>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Tenant Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <Input value={form.tenant_name} onChange={e => update('tenant_name', e.target.value)} placeholder="e.g. Priya Sharma" />
                </Field>
                <Field label="Father's / Spouse's Name">
                  <Input value={form.tenant_father_name} onChange={e => update('tenant_father_name', e.target.value)} placeholder="S/o or D/o" />
                </Field>
                <Field label="Address" required>
                  <Input value={form.tenant_address} onChange={e => update('tenant_address', e.target.value)} placeholder="Permanent / previous address" />
                </Field>
                <Field label="Aadhar Number" hint="Last 4 digits shown in agreement">
                  <Input value={form.tenant_aadhar} onChange={e => update('tenant_aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12-digit Aadhar number" />
                </Field>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed1}
                className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Next: Property & Terms &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Property Address" required>
                    <Input value={form.property_address} onChange={e => update('property_address', e.target.value)} placeholder="Full address of the rented property" />
                  </Field>
                </div>
                <Field label="Property Type">
                  <Select value={form.property_type} onChange={e => update('property_type', e.target.value)}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </Select>
                </Field>
                <Field label="Furnishing">
                  <Select value={form.furnishing} onChange={e => update('furnishing', e.target.value)}>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </Select>
                </Field>
                <Field label="State" required>
                  <Select value={form.state} onChange={e => update('state', e.target.value)}>
                    <option value="">Select State / UT</option>
                    {states.map(s => (
                      <option key={s.key} value={s.key}>{s.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="City">
                  <Input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Mumbai, Bengaluru" />
                </Field>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Rent & Financial Terms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Monthly Rent (₹)" required>
                  <Input type="number" value={form.monthly_rent} onChange={e => update('monthly_rent', e.target.value)} placeholder="e.g. 25000" min="1" />
                </Field>
                <Field label="Security Deposit (₹)">
                  <Input type="number" value={form.security_deposit} onChange={e => update('security_deposit', e.target.value)} placeholder="e.g. 100000" min="0" />
                </Field>
                <Field label="Maintenance Charges (₹/month)">
                  <Input type="number" value={form.maintenance_charges} onChange={e => update('maintenance_charges', e.target.value)} placeholder="0" min="0" />
                </Field>
                <Field label="Annual Rent Increment (%)">
                  <Input type="number" value={form.rent_increment_percent} onChange={e => update('rent_increment_percent', e.target.value)} placeholder="e.g. 10" min="0" max="100" />
                </Field>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Agreement Terms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Start Date" required>
                  <Input type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)} />
                </Field>
                <Field label="Duration (months)" required>
                  <Select value={form.duration_months} onChange={e => update('duration_months', parseInt(e.target.value))}>
                    {[6, 11, 12, 24, 36, 48, 60].map(m => (
                      <option key={m} value={m}>{m} months{m === 11 ? ' (most common)' : ''}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Notice Period (months)">
                  <Select value={form.notice_period_months} onChange={e => update('notice_period_months', parseInt(e.target.value))}>
                    {[1, 2, 3].map(m => (
                      <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Lock-in Period (months)">
                  <Select value={form.lock_in_months} onChange={e => update('lock_in_months', parseInt(e.target.value))}>
                    {[0, 3, 6, 12, 24].map(m => (
                      <option key={m} value={m}>{m === 0 ? 'No lock-in' : `${m} months`}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Purpose">
                  <Input value={form.purpose} onChange={e => update('purpose', e.target.value)} placeholder="Residential / Office / Shop" />
                </Field>
                <Field label="Language">
                  <Select value={form.language} onChange={e => update('language', e.target.value)}>
                    <option value="english">English</option>
                    <option value="bilingual">Bilingual (English + Hindi)</option>
                  </Select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Additional Clauses" hint="One clause per line. These will be added as extra terms.">
                    <textarea
                      value={form.additional_clauses}
                      onChange={e => update('additional_clauses', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors resize-none"
                      placeholder="e.g. Parking space included&#10;Pets allowed with deposit"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-brand-card border border-brand-border text-white font-medium rounded-lg hover:border-brand-primary transition-colors">
                &larr; Back
              </button>
              <button
                onClick={handlePreview}
                disabled={!canProceed2 || loading}
                className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Preview & Download'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && preview && (
          <div className="space-y-6">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Agreement Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-muted">Landlord</p>
                  <p className="text-white font-medium">{preview.landlord_name}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Tenant</p>
                  <p className="text-white font-medium">{preview.tenant_name}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-brand-muted">Property</p>
                  <p className="text-white font-medium">{preview.property_address}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Monthly Rent</p>
                  <p className="text-white font-medium">₹{Number(preview.monthly_rent).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Security Deposit</p>
                  <p className="text-white font-medium">₹{Number(preview.security_deposit).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Duration</p>
                  <p className="text-white font-medium">{preview.duration_months} months</p>
                </div>
                <div>
                  <p className="text-brand-muted">Start Date</p>
                  <p className="text-white font-medium">{preview.start_date}</p>
                </div>
              </div>
            </div>

            {preview.stamp_duty && !preview.stamp_duty.error && (
              <div className="bg-brand-card border border-brand-primary/30 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Stamp Duty Details — {preview.stamp_duty.state}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-brand-muted">Stamp Duty</p>
                    <p className="text-2xl font-bold text-brand-primary">₹{preview.stamp_duty.stamp_duty?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-brand-muted">Registration Fee</p>
                    <p className="text-2xl font-bold text-white">
                      {preview.stamp_duty.registration_required ? `₹${preview.stamp_duty.registration_fee?.toLocaleString('en-IN')}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-muted">Total Cost</p>
                    <p className="text-2xl font-bold text-brand-secondary">₹{preview.stamp_duty.total_cost?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-brand-muted">E-Stamp</p>
                    <p className="text-2xl font-bold text-white">{preview.stamp_duty.e_stamp_available ? 'Available' : 'N/A'}</p>
                  </div>
                </div>
                {preview.stamp_duty.notes && (
                  <p className="text-xs text-brand-muted mt-4">{preview.stamp_duty.notes}</p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-brand-card border border-brand-border text-white font-medium rounded-lg hover:border-brand-primary transition-colors">
                &larr; Edit Details
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white font-bold rounded-lg transition-colors text-lg"
              >
                {loading ? 'Generating PDF...' : 'Download Rent Agreement (PDF)'}
              </button>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-4 text-sm text-brand-muted">
              <p><strong className="text-white">Next Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Download the agreement PDF</li>
                <li>Print on stamp paper of ₹{preview.stamp_duty?.stamp_duty || 'appropriate'} value</li>
                <li>Both parties sign all pages</li>
                <li>Two witnesses sign the agreement</li>
                {preview.stamp_duty?.registration_required && <li>Register at the Sub-Registrar office</li>}
                <li>Each party keeps a copy</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
