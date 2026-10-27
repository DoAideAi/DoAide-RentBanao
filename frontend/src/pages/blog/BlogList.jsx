import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import BLOG_POSTS from './blogData'

export default function BlogList() {
  return (
    <>
      <Helmet>
        <title>Blog - RentBanao | Rent Agreement & Tenant Rights Guides</title>
        <meta name="description" content="Expert guides on rent agreement rules, stamp duty calculations, tenant rights, and rental laws in India. Free resources for landlords and tenants." />
        <link rel="canonical" href="https://rent.doaide.com/blog" />
        <meta property="og:title" content="Blog - RentBanao | Rent Agreement & Tenant Rights Guides" />
        <meta property="og:description" content="Expert guides on rent agreement rules, stamp duty calculations, tenant rights, and rental laws in India." />
        <meta property="og:url" content="https://rent.doaide.com/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">RentBanao Blog</h1>
        <p className="text-brand-muted mb-12 max-w-2xl">
          Expert guides on rent agreements, stamp duty, tenant rights, and rental laws in India.
        </p>

        <div className="space-y-6">
          {BLOG_POSTS.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-primary transition-colors group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-brand-muted mb-3">{post.metaDescription}</p>
              <div className="flex items-center gap-4 text-xs text-brand-muted">
                <span>{post.author}</span>
                <span>{post.readTime}</span>
                <span>{new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
