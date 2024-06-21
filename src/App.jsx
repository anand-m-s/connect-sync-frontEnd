import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserRoutes from './routes/userRouter/userRoutes'
import ErrorBoundary from './components/errorBoundary/errorBoundary'
import AdminRoutes from './routes/adminRouter/adminRoutes'
import { ColorModeProvider } from './context/colorModeContext'
import ChatProvider from './context/ChatProvider'
import { useEffect } from 'react'
import { setupInterceptors } from './constraints/axios/userAxios'
import { useDispatch } from 'react-redux'
import { logout } from './services/redux/slices/userAuthSlice'
import { toast } from 'sonner';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setupInterceptors(navigate, dispatch, logout,toast);
  }, [navigate, dispatch]);

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
