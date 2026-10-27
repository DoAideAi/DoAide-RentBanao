/**
 * Route metadata for SEO prerender.
 * Each entry produces a per-route HTML file at build time
 * with unique title, canonical, description, h1, JSON-LD, and social meta.
 * React hydrates on top of this shell.
 */

const SITE = 'https://rent.doaide.com'

const routes = [
  {
    path: '/',
    title: 'RentBanao - Free Rent Agreement Generator for India',
    description: 'Generate legally valid rent agreements for all Indian states. Free, no login required. Includes stamp duty calculator and state-specific templates.',
    h1: 'Rent Agreement Generator for India',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'RentBanao',
      description: 'Free Rent Agreement Generator for India with stamp duty calculator for all states',
      url: SITE,
      applicationCategory: 'Legal',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      creator: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
    },
  },
  {
    path: '/generator',
    title: 'Rent Agreement Generator - Create Free Rental Agreement Online | RentBanao',
    description: 'Generate a legally valid rent agreement for any Indian state. Fill a simple form and download your agreement as PDF. Free, no login required.',
    h1: 'Rent Agreement Generator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'RentBanao Rent Agreement Generator',
      description: 'Generate a legally valid rent agreement for any Indian state. Fill a simple form and download your agreement as PDF.',
      url: `${SITE}/generator`,
      applicationCategory: 'Legal',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  },
  {
    path: '/stamp-duty',
    title: 'Stamp Duty Calculator for Rent Agreements - All Indian States | RentBanao',
    description: 'Calculate stamp duty and registration fees for rent agreements across all Indian states and UTs. Compare rates, check e-stamp availability.',
    h1: 'Stamp Duty Calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'RentBanao Stamp Duty Calculator',
      description: 'Calculate stamp duty and registration fees for rent agreements across all Indian states.',
      url: `${SITE}/stamp-duty`,
      applicationCategory: 'Legal',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  },
  {
    path: '/templates',
    title: 'Rent Agreement Templates for All Indian States | RentBanao',
    description: 'Free rent agreement templates for Maharashtra, Karnataka, Delhi, Tamil Nadu, and all Indian states. Download state-specific rental agreement formats.',
    h1: 'Rent Agreement Templates by State',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Rent Agreement Templates for All Indian States',
      description: 'Free rent agreement templates for Maharashtra, Karnataka, Delhi, Tamil Nadu, and all Indian states.',
      url: `${SITE}/templates`,
      publisher: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
    },
  },
  {
    path: '/blog',
    title: 'Blog - RentBanao | Rent Agreement & Tenant Rights Guides',
    description: 'Expert guides on rent agreement rules, stamp duty calculations, tenant rights, and rental laws in India. Free resources for landlords and tenants.',
    h1: 'RentBanao Blog',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'RentBanao Blog',
      description: 'Expert guides on rent agreement rules, stamp duty calculations, tenant rights, and rental laws in India.',
      url: `${SITE}/blog`,
      publisher: { '@type': 'Organization', name: 'RentBanao', url: SITE },
    },
  },
]

// Blog posts
const blogPosts = [
  {
    slug: 'online-rent-agreement-india',
    title: 'Online Rent Agreement in India (2026): How to Make One in 10 Minutes',
    description: 'Create an online rent agreement in India in minutes — step-by-step 2026 guide covering e-stamping, Aadhaar e-sign, state portals, legal validity, and costs. Free generator included.',
    publishedDate: '2026-10-22',
    modifiedDate: '2026-10-22',
  },
  {
    slug: 'rent-agreement-stamp-duty',
    title: 'Rent Agreement Stamp Duty in India (2026): Rates, Calculation & How to Pay',
    description: 'Rent agreement stamp duty explained for 2026 — state-wise rates, exact calculation formula with examples in ₹, e-stamping steps, penalties for under-stamping, and who pays.',
    publishedDate: '2026-10-22',
    modifiedDate: '2026-10-22',
  },
  {
    slug: 'rent-agreement-rules-india',
    title: 'Rent Agreement Rules in India: Complete Guide for Landlords and Tenants (2024)',
    description: 'Learn all rent agreement rules in India — registration requirements, stamp duty, mandatory clauses, notice periods, and legal validity. State-wise guide for landlords and tenants.',
    publishedDate: '2024-12-15',
    modifiedDate: '2024-12-15',
  },
  {
    slug: 'stamp-duty-guide-rent-agreement-india',
    title: 'Stamp Duty on Rent Agreements in India: State-Wise Guide & Calculator (2024)',
    description: 'Complete state-wise guide to stamp duty on rent agreements in India. Learn stamp duty rates, e-stamp process, calculation methods, and how to save on stamp duty legally.',
    publishedDate: '2024-12-15',
    modifiedDate: '2024-12-15',
  },
  {
    slug: 'tenant-rights-india',
    title: 'Tenant Rights in India: Know Your Legal Protections as a Renter (2024)',
    description: 'Complete guide to tenant rights in India. Learn about protection from illegal eviction, security deposit refund rules, rent increase limits, essential services, and the Model Tenancy Act 2021.',
    publishedDate: '2024-12-15',
    modifiedDate: '2024-12-15',
  },
]

for (const post of blogPosts) {
  routes.push({
    path: `/blog/${post.slug}`,
    title: `${post.title} | RentBanao Blog`,
    description: post.description,
    h1: post.title,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedDate,
      dateModified: post.modifiedDate,
      author: { '@type': 'Organization', name: 'RentBanao', url: SITE },
      publisher: { '@type': 'Organization', name: 'RentBanao', url: SITE },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    },
  })
}

// State templates
const stateTemplates = [
  { slug: 'maharashtra', name: 'Maharashtra', metaDesc: 'Free rent agreement template for Maharashtra. Leave and licence format with correct stamp duty (0.25% of total rent + deposit). IGR e-registration guide.' },
  { slug: 'karnataka', name: 'Karnataka', metaDesc: 'Free rent agreement template for Karnataka. 1% stamp duty on annual rent. Kaveri online portal registration guide for Bengaluru and all districts.' },
  { slug: 'delhi', name: 'Delhi (NCT)', metaDesc: 'Free rent agreement template for Delhi NCT. 2% stamp duty calculator, e-stamp availability, registration guide for Delhi rental agreements.' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', metaDesc: 'Free rent agreement template for Tamil Nadu. 1% stamp duty, TNREGINET registration, e-stamp availability for Chennai and all districts.' },
  { slug: 'telangana', name: 'Telangana', metaDesc: 'Free rent agreement template for Telangana. 0.5% stamp duty, DHARANI portal registration, e-stamp guide for Hyderabad and all districts.' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', metaDesc: 'Free rent agreement template for Uttar Pradesh. 2% stamp duty calculator, e-stamp availability for Noida, Lucknow, and all UP districts.' },
  { slug: 'west-bengal', name: 'West Bengal', metaDesc: 'Free rent agreement template for West Bengal. Low 0.25% stamp duty, e-stamp availability for Kolkata and all districts.' },
  { slug: 'gujarat', name: 'Gujarat', metaDesc: 'Free rent agreement template for Gujarat. 1% stamp duty, e-stamp guide for Ahmedabad, Surat, and all Gujarat districts.' },
  { slug: 'rajasthan', name: 'Rajasthan', metaDesc: 'Free rent agreement template for Rajasthan. 1% stamp duty, e-stamp availability for Jaipur and all Rajasthan districts.' },
  { slug: 'kerala', name: 'Kerala', metaDesc: 'Free rent agreement template for Kerala. ₹200 stamp duty for 11-month agreements, e-stamp guide for Kochi, Trivandrum, and all Kerala districts.' },
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh', metaDesc: 'Free rent agreement template for Andhra Pradesh. 5% stamp duty or ₹500, registration guide for Hyderabad and all AP districts.' },
  { slug: 'punjab', name: 'Punjab', metaDesc: 'Free rent agreement template for Punjab. Fixed stamp duty, e-stamp guide for Chandigarh, Ludhiana, and all Punjab districts.' },
  { slug: 'haryana', name: 'Haryana', metaDesc: 'Free rent agreement template for Haryana. Slab-based stamp duty, e-stamp guide for Gurugram, Faridabad, and all Haryana districts.' },
  { slug: 'bihar', name: 'Bihar', metaDesc: 'Free rent agreement template for Bihar. 2% stamp duty, e-stamp availability for Patna and all Bihar districts.' },
]

for (const st of stateTemplates) {
  routes.push({
    path: `/templates/${st.slug}`,
    title: `Rent Agreement Template for ${st.name} | RentBanao`,
    description: st.metaDesc,
    h1: `Rent Agreement Template for ${st.name}`,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Rent Agreement Template for ${st.name}`,
      description: st.metaDesc,
      author: { '@type': 'Organization', name: 'DoAide' },
      url: `${SITE}/templates/${st.slug}`,
    },
  })
}

export { routes, SITE }
export default routes
