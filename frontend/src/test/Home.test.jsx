import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from '../pages/Home'

function renderHome() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('Home', () => {
  it('renders the hero section', () => {
    renderHome()
    expect(screen.getByText(/for India/i)).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    renderHome()
    expect(screen.getByText('Rent Agreement Generator')).toBeInTheDocument()
    expect(screen.getByText('Stamp Duty Calculator')).toBeInTheDocument()
    expect(screen.getByText('State Templates')).toBeInTheDocument()
  })

  it('renders how it works section', () => {
    renderHome()
    expect(screen.getByText('Fill the Form')).toBeInTheDocument()
    expect(screen.getByText('Review & Customize')).toBeInTheDocument()
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })

  it('renders FAQ section', () => {
    renderHome()
    expect(screen.getByText(/Is this rent agreement legally valid/i)).toBeInTheDocument()
    expect(screen.getByText(/Is this tool really free/i)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    renderHome()
    expect(screen.getByText('Generate Rent Agreement')).toBeInTheDocument()
    expect(screen.getByText('Calculate Stamp Duty')).toBeInTheDocument()
  })

  it('shows state highlights', () => {
    renderHome()
    expect(screen.getByText('Maharashtra')).toBeInTheDocument()
    expect(screen.getByText('Karnataka')).toBeInTheDocument()
    expect(screen.getByText('Delhi')).toBeInTheDocument()
  })
})
