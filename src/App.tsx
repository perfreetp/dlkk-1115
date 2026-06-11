import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import EpisodeWorkbench from './pages/EpisodeWorkbench'
import GuestLibrary from './pages/GuestLibrary'
import MaterialLibrary from './pages/MaterialLibrary'
import ReviewCenter from './pages/ReviewCenter'
import PublishCalendar from './pages/PublishCalendar'
import StatisticsArchive from './pages/StatisticsArchive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="episode/:id" element={<EpisodeWorkbench />} />
        <Route path="guests" element={<GuestLibrary />} />
        <Route path="materials" element={<MaterialLibrary />} />
        <Route path="review" element={<ReviewCenter />} />
        <Route path="publish" element={<PublishCalendar />} />
        <Route path="statistics" element={<StatisticsArchive />} />
      </Route>
    </Routes>
  )
}
