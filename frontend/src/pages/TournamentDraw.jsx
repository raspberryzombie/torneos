import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './TournamentDraw.css';

const TournamentDraw = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drawData, setDrawData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDraw();
  }, [id, user]);

  const fetchDraw = async () => {
    try {
      const res = await api.get(`/api/tournaments/${id}/matches`);
      setDrawData(res.data);
    } catch (err) {
      console.error('Error fetching draw:', err);
    } finally {
      setLoading(false);
    }
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

  const renderMatch = (match, index) => (
    <div key={match.id || index} className={`bracket-match ${getStatusClass(match.status)}`}>
      <div className={`match-player ${match.winner && match.player1 === match.winner ? 'winner' : ''}`}>
        <span className="player-name">{match.player1}</span>
        {match.winner && match.player1 === match.winner && <span className="winner-badge">✓</span>}
      </div>
      <div className={`match-player ${match.winner && match.player2 === match.winner ? 'winner' : ''}`}>
        <span className="player-name">{match.player2}</span>
        {match.winner && match.player2 === match.winner && <span className="winner-badge">✓</span>}
      </div>
      {match.score && <div className="match-score">{match.score}</div>}
    </div>
  );

  if (loading) {
    return (
      <div className="draw-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="draw-container">
      <header className="draw-header">
        <Link to={`/tournaments/${id}`} className="back-btn">←</Link>
        <h1>Cuadro</h1>
        <div style={{ width: 40 }}></div>
      </header>

      {drawData && (
        <div className="draw-content">
          <h2 className="tournament-name">{drawData.tournament_name}</h2>

          {drawData.rounds.length === 0 ? (
            <div className="empty-state">
              <p>Los partidos no han sido generados</p>
              <p className="empty-hint">Pronto podrás ver el cuadro del torneo</p>
            </div>
          ) : (
            <div className="brackets-container">
              {drawData.rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="round-column">
                  <h3 className="round-name">{round.name}</h3>
                  <div className="round-matches">
                    {round.matches.map((match, matchIndex) => renderMatch(match, matchIndex))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentDraw;