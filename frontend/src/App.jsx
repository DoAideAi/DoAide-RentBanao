import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Generator from './pages/Generator'
import StampDuty from './pages/StampDuty'
import Templates from './pages/Templates'
import StateTemplate from './pages/StateTemplate'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/stamp-duty" element={<StampDuty />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:stateSlug" element={<StateTemplate />} />
      </Routes>
    </Layout>
  )
}
