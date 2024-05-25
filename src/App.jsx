import './App.css'
import { Routes, Route } from 'react-router-dom'
import UserRoutes from './routes/userRouter/userRoutes'
import ErrorBoundary from './components/errorBoundary/errorBoundary'
import AdminRoutes from './routes/adminRouter/adminRoutes'
import { ColorModeProvider } from './context/colorModeContext'



function App() {

  return (
    <>
      <ColorModeProvider>
        <Routes>
          <Route
            path='/*'
            element={
              <ErrorBoundary>
                <UserRoutes />
              </ErrorBoundary>
            }
          />
          <Route
            path='/admin/*'
            element={
              <ErrorBoundary>
                <AdminRoutes />
              </ErrorBoundary>
            }
          />
        </Routes>
      </ColorModeProvider>
    </>
  )
}

export default App
