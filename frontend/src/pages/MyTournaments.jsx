import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './MyTournaments.css';

const MyTournaments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyTournaments();
  }, [user]);

  const fetchMyTournaments = async () => {
    try {
      const res = await api.get('/api/tournaments/me');
      setTournaments(res.data);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: { label: 'Abierto', class: 'badge-open' },
      full: { label: 'Completo', class: 'badge-full' },
      cancelled: { label: 'Cancelado', class: 'badge-cancelled' },
      completed: { label: 'Finalizado', class: 'badge-completed' },
    };
    return badges[status] || { label: status, class: '' };
  };

  if (!user) return null;

  return (
    <div className="my-tournaments-container">
      <header className="myt-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>Mis Torneos</h1>
        <Link to="/create-tournament" className="add-btn">+</Link>
      </header>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No tenés torneitos creados</p>
          <Link to="/create-tournament" className="empty-link">
            Crear mi primer torneo
          </Link>
        </div>
      ) : (
        <div className="tournaments-list">
          {tournaments.map((t) => {
            const statusBadge = getStatusBadge(t.status);
            return (
              <div key={t.id} className="tournament-card-wrapper">
                <Link
                  to={`/tournaments/${t.id}`}
                  className="tournament-card"
                >
                  <div className="tournament-info">
                    <h3>{t.name}</h3>
                    <p className="venue">{t.venue}</p>
                    <div className="tournament-meta">
                      <span>{formatDate(t.start_date)}</span>
                      {t.category && <span>{t.category}</span>}
                      <span>{t.registered_count}/{t.capacity}</span>
                    </div>
                  </div>
                  <div className="tournament-status">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
                <button
                  className="delegate-qr-btn"
                  onClick={(e) => { e.preventDefault(); navigate(`/tournaments/${t.id}/delegate-qr`); }}
                  data-testid={`delegate-qr-btn-${t.id}`}
                  title="Generar QR de Editor"
                >
                  📱
                </button>
              </div>
            );
          })}
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item" data-testid="schedule-nav">
          <span className="nav-icon">📅</span>
          <span>Horario</span>
        </Link>
        <Link to="/tournaments" className="nav-item" data-testid="tournaments-nav">
          <span className="nav-icon">🏆</span>
          <span>Torneos</span>
        </Link>
        <Link to="/profile" className="nav-item" data-testid="profile-nav">
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
};

export default MyTournaments;