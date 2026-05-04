import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DelegateBanner from './components/DelegateBanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import CreateTournament from './pages/CreateTournament';
import MyTournaments from './pages/MyTournaments';
import TournamentDraw from './pages/TournamentDraw';
import DelegateScanner from './pages/DelegateScanner';
import DelegateQR from './pages/DelegateQR';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DelegateBanner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/delegate/scan" element={
            <ProtectedRoute>
              <DelegateScanner />
            </ProtectedRoute>
          } />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments"
            element={
              <ProtectedRoute>
                <Tournaments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/:id"
            element={
              <ProtectedRoute>
                <TournamentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-tournament"
            element={
              <ProtectedRoute>
                <CreateTournament />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tournaments"
            element={
              <ProtectedRoute>
                <MyTournaments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/:id/draw"
            element={
              <ProtectedRoute>
                <TournamentDraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/:tournamentId/delegate-qr"
            element={
              <ProtectedRoute>
                <DelegateQR />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;