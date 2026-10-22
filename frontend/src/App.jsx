import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const Generator = lazy(() => import('./pages/Generator'))
const StampDuty = lazy(() => import('./pages/StampDuty'))
const Templates = lazy(() => import('./pages/Templates'))
const StateTemplate = lazy(() => import('./pages/StateTemplate'))
const BlogList = lazy(() => import('./pages/blog/BlogList'))
const BlogPost = lazy(() => import('./pages/blog/BlogPost'))

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex justify-center py-16 text-brand-muted">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/stamp-duty" element={<StampDuty />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:stateSlug" element={<StateTemplate />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
