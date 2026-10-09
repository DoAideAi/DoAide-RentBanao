import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from '../App'

function renderApp(route = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('App', () => {
  it('renders the home page hero', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Generate Rent Agreement')).toBeInTheDocument()
  })

  it('renders the navigation with brand name', () => {
    renderApp('/')
    expect(screen.getAllByText('RentBanao').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the generator page heading', () => {
    renderApp('/generator')
    expect(screen.getByRole('heading', { level: 1, name: /Rent Agreement Generator/i })).toBeInTheDocument()
    expect(screen.getByText('Landlord Details')).toBeInTheDocument()
  })

  it('renders the stamp duty page heading', () => {
    renderApp('/stamp-duty')
    expect(screen.getByRole('heading', { level: 1, name: /Stamp Duty Calculator/i })).toBeInTheDocument()
  })

  it('renders the templates page with state list', () => {
    renderApp('/templates')
    expect(screen.getByRole('heading', { level: 1, name: /Rent Agreement Templates by State/i })).toBeInTheDocument()
    expect(screen.getByText('Maharashtra')).toBeInTheDocument()
  })

  it('renders a state template page', () => {
    renderApp('/templates/maharashtra')
    expect(screen.getByRole('heading', { level: 1, name: /Rent Agreement Template for Maharashtra/i })).toBeInTheDocument()
  })

  it('renders 404 for unknown state', () => {
    renderApp('/templates/unknown-state')
    expect(screen.getByText('State Not Found')).toBeInTheDocument()
  })

  it('renders the footer with DoAide link', () => {
    renderApp('/')
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
