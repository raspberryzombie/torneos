import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Tournaments.css';

const Tournaments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  const fetchTournaments = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      
      const res = await api.get(`/api/tournaments?${params.toString()}`);
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

  const getCategoryLabel = (cat) => {
    const labels = {
      masculino: 'Masculino',
      femenino: 'Femenino',
      open: 'Open',
    };
    return labels[cat] || cat;
  };

  const getFormatLabel = (fmt) => {
    const labels = {
      singles: 'Singles',
      dobles: 'Dobles',
      mixto: 'Mixto',
    };
    return labels[fmt] || fmt;
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="tournaments-container">
      <header className="tournaments-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>Torneos</h1>
        <div className="user-avatar">
          {user.photo_url ? (
            <img src={user.photo_url} alt={user.name} />
          ) : (
            <span>{user.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Ubicación"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="filter-input"
          data-testid="filter-location"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
          data-testid="filter-category"
        >
          <option value="">Todas las categorías</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="open">Open</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No hay tournaments programados</p>
          <p className="empty-hint">Pronto habrá nuevos torneitos</p>
        </div>
      ) : (
        <div className="tournaments-list">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              to={`/tournaments/${t.id}`}
              className="tournament-card"
              data-testid={`tournament-card-${t.id}`}
            >
              <div className="tournament-info">
                <h3 data-testid="tournament-name">{t.name}</h3>
                <p className="venue">{t.venue}</p>
                <div className="tournament-meta">
                  <span>{formatDate(t.start_date)}</span>
                  {t.category && <span>{getCategoryLabel(t.category)}</span>}
                  {t.format && <span>{getFormatLabel(t.format)}</span>}
                </div>
              </div>
              <div className="tournament-status">
                {t.is_registered ? (
                  <span className="registered-badge" data-testid="tournament-registered">Inscrito</span>
                ) : (
                  <span className="spots">{t.registered_count}/{t.capacity}</span>
                )}
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item" data-testid="schedule-nav">
          <span className="nav-icon">📅</span>
          <span>Horario</span>
        </Link>
        <Link to="/tournaments" className="nav-item active" data-testid="tournaments-nav">
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

export default Tournaments;