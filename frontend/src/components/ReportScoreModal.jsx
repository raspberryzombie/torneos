import { useState } from 'react';
import api from '../services/api';
import { usePermissions } from '../hooks/usePermissions';
import './ReportScoreModal.css';

const ReportScoreModal = ({ match, onClose, onSuccess }) => {
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const permissions = usePermissions();
  const hasExistingResult = match.score && match.score.score_string;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!score.trim()) {
      setError('Ingresá el resultado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const winnerId = match.player1_id;
      await api.post(`/api/matches/${match.id}/score`, {
        score: score,
        winner_id: winnerId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al reportar score');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/api/matches/${match.id}/confirm`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al confirmar');
    } finally {
      setLoading(false);
    }
  };

  const handleDispute = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/api/matches/${match.id}/dispute`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al disputear');
    } finally {
      setLoading(false);
    }
  };

  const isPendingConfirmation = match.status === 'pending_confirmation';
  const isPlayer1 = match.player1_id !== undefined;

  if (hasExistingResult && !permissions.canEditExisting) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Resultado del Partido</h3>
          <p className="match-info">
            vs <strong>{match.opponent_name}</strong>
          </p>
          <div className="current-score">
            <span>Score reportado:</span>
            <strong>{match.score.score_string}</strong>
          </div>
          <p className="error-message">
            No tenés permiso para editar este resultado
          </p>
          <button className="btn-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Resultado del Partido</h3>
        <p className="match-info">
          vs <strong>{match.opponent_name}</strong>
        </p>
        <p className="tournament-name">{match.tournament_name}</p>

        {match.score && (
          <div className="current-score">
            <span>Score reportado:</span>
            <strong>{match.score.score_string}</strong>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {isPendingConfirmation ? (
          <div className="confirm-actions">
            <p>¿Confirmás el resultado?</p>
            <div className="action-buttons">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-confirm"
              >
                {loading ? 'Confirmando...' : 'Confirmar'}
              </button>
              <button
                onClick={handleDispute}
                disabled={loading}
                className="btn-dispute"
              >
                Disputear
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ej: 6-4, 6-3, 6-2"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="score-input"
            />
            <button type="submit" disabled={loading} className="btn-report">
              {loading ? 'Reportando...' : 'Reportar Resultado'}
            </button>
          </form>
        )}

        <button className="btn-close" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ReportScoreModal;