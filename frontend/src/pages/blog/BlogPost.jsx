import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import BLOG_POSTS from './blogData'

export default function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-brand-primary hover:underline">Back to Blog</Link>
      </div>
    )
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Organization',
      name: 'RentBanao',
      url: 'https://rent.doaide.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'RentBanao',
      url: 'https://rent.doaide.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rent.doaide.com/blog/${post.slug}`
    },
    image: 'https://rent.doaide.com/favicon.svg'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | RentBanao Blog</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://rent.doaide.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://rent.doaide.com/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:modified_time" content={post.modifiedDate} />
        <script type="application/ld+json">{JSON.stringify(blogPostingSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-16">
        <nav className="mb-8 text-sm text-brand-muted">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-brand-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{post.title.split(':')[0]}</span>
        </nav>

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-brand-muted">
            <span>{post.author}</span>
            <span>{post.readTime}</span>
            <span>Published {new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div
          className="prose prose-invert prose-emerald max-w-none
            prose-headings:text-white prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-li:text-gray-300 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-ul:space-y-1 prose-ol:space-y-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.faqs.length > 0 && (
          <section className="mt-16 pt-10 border-t border-brand-border">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {post.faqs.map(faq => (
                <details key={faq.question} className="bg-brand-card border border-brand-border rounded-lg group">
                  <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:text-brand-primary transition-colors list-none flex justify-between items-center">
                    {faq.question}
                    <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-sm text-brand-300 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 p-6 bg-brand-card border border-brand-border rounded-xl text-center">
          <h3 className="text-lg font-bold text-white mb-2">Ready to Create Your Rent Agreement?</h3>
          <p className="text-sm text-brand-muted mb-4">Generate a legally valid rent agreement in minutes — free, no login required.</p>
          <Link to="/generator" className="inline-block px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg transition-colors">
            Generate Rent Agreement
          </Link>
        </div>
      </article>
    </>
  )
}
