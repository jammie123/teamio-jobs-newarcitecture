import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CandidatePerPositionPage } from '../pages/CandidatePerPositionPage'
import { JobListingPage } from '../pages/JobListingPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobListingPage />} />
        <Route path="/nabory/:jobId/uchazeci" element={<CandidatePerPositionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
