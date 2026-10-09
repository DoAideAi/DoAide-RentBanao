import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/generator', label: 'Generator' },
  { to: '/stamp-duty', label: 'Stamp Duty' },
  { to: '/templates', label: 'Templates' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-brand-border bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-brand-primary transition-colors">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#10B981"/>
              <text x="50" y="68" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="48">RB</text>
            </svg>
            RentBanao
          </Link>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-brand-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-brand-border px-4 py-2 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-brand-primary'
                    : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-brand-border py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-white mb-3">RentBanao</h3>
              <p className="text-sm text-brand-muted">
                Free rent agreement generator for India. Create legally valid rental
                agreements with correct stamp duty for all states.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Tools</h3>
              <ul className="space-y-2 text-sm text-brand-muted">
                <li><Link to="/generator" className="hover:text-brand-primary transition-colors">Rent Agreement Generator</Link></li>
                <li><Link to="/stamp-duty" className="hover:text-brand-primary transition-colors">Stamp Duty Calculator</Link></li>
                <li><Link to="/templates" className="hover:text-brand-primary transition-colors">State Templates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Legal</h3>
              <p className="text-sm text-brand-muted">
                This tool generates agreement drafts for reference. Please consult a legal
                professional for binding agreements. Stamp duty info is approximate.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-brand-border text-center text-xs text-brand-muted">
            <p>&copy; {new Date().getFullYear()} DoAide. All rights reserved.</p>
            <p className="mt-1">
              A <a href="https://doaide.com" className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">DoAide</a> product.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
