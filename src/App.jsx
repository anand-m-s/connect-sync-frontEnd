import './App.css'
import { Routes, Route } from 'react-router-dom'
import UserRoutes from './routes/userRouter/userRoutes'
import  ErrorBoundary from './components/errorBoundary/errorBoundary'

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/*'
          element={
            <ErrorBoundary>
              <UserRoutes />
            </ErrorBoundary>
          }
        />
      </Routes>



    </>
  )
}

export default App
