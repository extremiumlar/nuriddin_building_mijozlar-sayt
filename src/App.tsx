import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '@/pages/Landing'
import { LoginPage } from '@/pages/Login'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/components/ThemeProvider'
import { installMockAdapter } from '@/api/mock/adapter'
import { appConfig } from '@/config/app'

import { DashboardPage } from '@/pages/Dashboard'
import { ConstructionPage } from '@/pages/Construction'
import { PaymentsPage } from '@/pages/Payments'
import { LotteryPage } from '@/pages/Lottery'
import { BookingPage } from '@/pages/Booking'
import { ProfilePage } from '@/pages/Profile'

if (appConfig.useMock) {
  installMockAdapter()
}

function App() {
  useEffect(() => {
    document.documentElement.lang = 'uz'
  }, [])

  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/construction" element={<ConstructionPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/lottery" element={<LotteryPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
