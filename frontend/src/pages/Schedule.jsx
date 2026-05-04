import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ReportScoreModal from '../components/ReportScoreModal';
import './Schedule.css';

const Schedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todayMatches, setTodayMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSchedule();
  }, [user]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/api/matches');
      setTodayMatches(res.data.today || []);
      setUpcomingMatches(res.data.upcoming || []);
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'Programado',
      in_progress: 'En curso',
      pending_confirmation: 'Confirmar',
      completed: 'Finalizado',
      cancelled: 'Cancelado',
      disputed: 'Disputeado',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      scheduled: 'status-scheduled',
      in_progress: 'status-active',
      pending_confirmation: 'status-pending',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      disputed: 'status-disputed',
    };
    return classes[status] || '';
  };

  const canReport = (match) => {
    if (match.status !== 'scheduled' && match.status !== 'in_progress') return false;
    const matchFinished = new Date(match.scheduled_at) < new Date();
    return matchFinished || match.status === 'in_progress';
  };

  const renderMatchCard = (match) => (
    <div key={match.id} className="match-card" data-testid={`match-card-${match.id}`}>
      <div className="match-opponent">
        <span className="vs">vs</span>
        <span className="opponent-name" data-testid="match-opponent">{match.opponent_name}</span>
      </div>
      <div className="match-details">
        <span className="match-time" data-testid="match-time">{formatTime(match.scheduled_at)}</span>
        {match.court && <span className="match-court" data-testid="match-court">Court {match.court}</span>}
        <span className={`match-status ${getStatusClass(match.status)}`} data-testid="match-status">
          {getStatusLabel(match.status)}
        </span>
      </div>
      <div className="match-tournament" data-testid="match-tournament">{match.tournament_name}</div>
      
      {(match.status === 'pending_confirmation' || canReport(match)) && (
        <button
          className="btn-report-score"
          onClick={() => setSelectedMatch(match)}
          data-testid="match-report-score"
        >
          {match.status === 'pending_confirmation' ? 'Confirmar Resultado' : 'Reportar Score'}
        </button>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h1>Hola, {user.name}</h1>
        <Link to="/profile" className="profile-link">
          <div className="user-avatar">
            {user.photo_url ? (
              <img src={user.photo_url} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </Link>
      </header>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          <section className="schedule-section">
            <h2>HOY</h2>
            {todayMatches.length === 0 ? (
              <div className="empty-state">
                <p>No tenés partidos hoy</p>
              </div>
            ) : (
              <div className="matches-list">
                {todayMatches.map(renderMatchCard)}
              </div>
            )}
          </section>

          <section className="schedule-section">
            <h2>PRÓXIMOS 7 DÍAS</h2>
            {upcomingMatches.length === 0 ? (
              <div className="empty-state">
                <p>No tenés partidos programados</p>
                <Link to="/tournaments" className="empty-link">
                  Encontrá tournaments y inscribite
                </Link>
              </div>
            ) : (
              <div className="matches-list">
                {upcomingMatches.map(renderMatchCard)}
              </div>
            )}
          </section>

          {registrations.length > 0 && (
            <section className="schedule-section">
              <h2>MIS TORNEOS</h2>
              <div className="registrations-list">
                {registrations.map((reg) => (
                  <Link
                    key={reg.registration_id}
                    to={`/tournaments/${reg.tournament_id}`}
                    className="registration-card"
                  >
                    <div className="reg-info">
                      <span className="reg-name">{reg.tournament_name}</span>
                      <span className="reg-venue">{reg.venue}</span>
                    </div>
                    <span className="reg-date">{formatDate(reg.start_date)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item active" data-testid="schedule-nav">
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

      {selectedMatch && (
        <ReportScoreModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={fetchSchedule}
        />
      )}
    </div>
  );
};

export default Schedule;