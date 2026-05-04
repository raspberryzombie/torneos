import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { delegateService } from '../services/api';

const DelegateQR = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [hoursValid, setHoursValid] = useState(24);
  const [singleUse, setSingleUse] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await delegateService.generateQR(tournamentId, { hours_valid: hoursValid, single_use: singleUse });
      setQrData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al generar QR');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (qrData?.qr_code) {
      navigator.clipboard.writeText(qrData.qr_code);
    }
  };

  return (
    <div className="delegate-qr" data-testid="delegate-qr">
      <div className="delegate-qr-header">
        <button onClick={() => navigate(-1)} className="btn-back" data-testid="delegate-qr-back-btn">
          ← Volver
        </button>
        <h2 data-testid="delegate-qr-title">Generar QR de Editor</h2>
      </div>

      {error && <div className="error-message" data-testid="delegate-qr-error">{error}</div>}

      {!qrData ? (
        <div className="delegate-qr-form" data-testid="delegate-qr-form">
          <div className="form-group">
            <label data-testid="delegate-qr-hours-label">Horas de validez:</label>
            <select
              value={hoursValid}
              onChange={(e) => setHoursValid(Number(e.target.value))}
              data-testid="delegate-qr-hours-select"
            >
              <option value={1}>1 hora</option>
              <option value={4}>4 horas</option>
              <option value={12}>12 horas</option>
              <option value={24}>24 horas</option>
              <option value={48}>48 horas</option>
            </select>
          </div>

          <div className="form-group">
            <label data-testid="delegate-qr-single-use-label">
              <input
                type="checkbox"
                checked={singleUse}
                onChange={(e) => setSingleUse(e.target.checked)}
                data-testid="delegate-qr-single-use-checkbox"
              />
              Un solo uso
            </label>
          </div>

          <button
            onClick={generateQR}
            disabled={loading}
            className="btn-primary"
            data-testid="delegate-qr-generate-btn"
          >
            {loading ? 'Generando...' : 'Generar QR'}
          </button>
        </div>
      ) : (
        <div className="delegate-qr-result" data-testid="delegate-qr-result">
          <div className="qr-display" data-testid="delegate-qr-display">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.qr_code)}`}
              alt="QR Code"
              data-testid="delegate-qr-image"
            />
          </div>

          <div className="qr-info" data-testid="delegate-qr-info">
            <p><strong>Válido hasta:</strong> {new Date(qrData.expires_at).toLocaleString()}</p>
            <p><strong>Un solo uso:</strong> {qrData.single_use ? 'Sí' : 'No'}</p>
          </div>

          <div className="qr-actions">
            <button onClick={copyToClipboard} className="btn-secondary" data-testid="delegate-qr-copy-btn">
              Copiar Código
            </button>
            <button onClick={() => setQrData(null)} className="btn-primary" data-testid="delegate-qr-new-btn">
              Generar Nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelegateQR;