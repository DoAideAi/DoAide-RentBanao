const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchStates() {
  const r = await fetch(`${API_BASE}/api/stamp-duty/states`)
  return r.json()
}

export async function calculateStampDuty(data) {
  const r = await fetch(`${API_BASE}/api/stamp-duty/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return r.json()
}

export async function compareAllStates() {
  const r = await fetch(`${API_BASE}/api/stamp-duty/compare/all`)
  return r.json()
}

export async function previewAgreement(data) {
  const r = await fetch(`${API_BASE}/api/preview-agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return r.json()
}

export async function generateAgreementPdf(data) {
  const r = await fetch(`${API_BASE}/api/generate-agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!r.ok) throw new Error('Failed to generate PDF')
  return r.blob()
}

export async function submitFeedback(message, page) {
  const r = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, page }),
  })
  return r.json()
}
