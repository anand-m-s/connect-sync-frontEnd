import './App.css'
import { Routes, Route } from 'react-router-dom'
import UserRoutes from './routes/userRouter/userRoutes'
import ErrorBoundary from './components/errorBoundary/errorBoundary'
import AdminRoutes from './routes/adminRouter/adminRoutes'
import { ColorModeProvider } from './context/colorModeContext'
import ChatProvider from './context/ChatProvider'



function App() {

  return (
    <>
      <ColorModeProvider>
        <ChatProvider>
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
        </ChatProvider>
      </ColorModeProvider>
    </>
  )
}

export default App
