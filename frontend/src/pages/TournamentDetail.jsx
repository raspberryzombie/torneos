import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './TournamentDetail.css';

const TournamentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTournament();
  }, [id, user]);

  const fetchTournament = async () => {
    try {
      const res = await api.get(`/api/tournaments/${id}`);
      setTournament(res.data);
    } catch (err) {
      console.error('Error fetching tournament:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setRegistering(true);
    try {
      await api.post(`/api/tournaments/${id}/register`);
      setSuccess('Te inscribiste correctamente');
      fetchTournament();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al inscribirse');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    setError('');
    setRegistering(true);
    try {
      await api.delete(`/api/tournaments/${id}/register`);
      setSuccess('Inscripción cancelada');
      fetchTournament();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cancelar');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="tournament-detail-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="tournament-detail-container">
        <div className="error">Torneo no encontrado</div>
        <Link to="/tournaments" className="back-link">Volver a torneos</Link>
      </div>
    );
  }

  return (
    <div className="tournament-detail-container">
      <header className="detail-header">
        <Link to="/tournaments" className="back-btn">←</Link>
        <h1>Detalles</h1>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="detail-card">
        <h2>{tournament.name}</h2>
        
        {tournament.description && (
          <p className="description">{tournament.description}</p>
        )}

        <div className="info-section">
          <div className="info-row">
            <span className="info-label">Fecha</span>
            <span className="info-value">
              {formatDateShort(tournament.start_date)} - {formatDateShort(tournament.end_date)}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Lugar</span>
            <span className="info-value">{tournament.venue}</span>
          </div>

          {tournament.address && (
            <div className="info-row">
              <span className="info-label">Dirección</span>
              <span className="info-value">{tournament.address}</span>
            </div>
          )}

          {tournament.category && (
            <div className="info-row">
              <span className="info-label">Categoría</span>
              <span className="info-value capitalize">{tournament.category}</span>
            </div>
          )}

          {tournament.format && (
            <div className="info-row">
              <span className="info-label">Formato</span>
              <span className="info-value capitalize">{tournament.format}</span>
            </div>
          )}

          <div className="info-row">
            <span className="info-label">Cupo</span>
            <span className="info-value">{tournament.registered_count} / {tournament.capacity}</span>
          </div>

          {tournament.entry_fee && (
            <div className="info-row">
              <span className="info-label">Inscripción</span>
              <span className="info-value">${tournament.entry_fee}</span>
            </div>
          )}

          {tournament.organizer_name && (
            <div className="info-row">
              <span className="info-label">Organizador</span>
              <span className="info-value">{tournament.organizer_name}</span>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="action-section">
          {tournament.is_registered ? (
            <button
              onClick={handleCancel}
              disabled={registering}
              className="btn-cancel"
              data-testid="tournament-cancel-register"
            >
              {registering ? 'Cancelando...' : 'Cancelar Inscripción'}
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering || tournament.status !== 'open'}
              className="btn-register"
              data-testid="tournament-register"
            >
              {registering
                ? 'Inscribiendo...'
                : tournament.status === 'full'
                ? 'Torneo Completo'
                : 'Inscribirse'}
            </button>
          )}
        </div>

        <Link to={`/tournaments/${id}/draw`} className="btn-draw" data-testid="tournament-view-draw">
          Ver Cuadro del Torneo
        </Link>
      </div>
    </div>
  );
};

export default TournamentDetail;