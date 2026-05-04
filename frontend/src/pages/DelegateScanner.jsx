import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DelegateScanner = () => {
  const { activateDelegate, delegateSession } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (delegateSession) {
      navigate('/');
    }
  }, [delegateSession, navigate]);

  const startScanning = async () => {
    setError('');
    setSuccess('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      setScanning(true);
    } catch (err) {
      setError('No se pudo acceder a la cámara');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleManualInput = async (e) => {
    e.preventDefault();
    const token = e.target.elements.token.value.trim();
    if (!token) {
      setError('Ingresa el código del QR');
      return;
    }

    const success = await activateDelegate(token);
    if (success) {
      setSuccess('Sesión de editor activada correctamente');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Código QR inválido o expirado');
    }
  };

  return (
    <div className="delegate-scanner" data-testid="delegate-scanner">
      <h2 data-testid="delegate-scanner-title">Escanear Código QR de Editor</h2>

      {error && <div className="error-message" data-testid="delegate-scanner-error">{error}</div>}
      {success && <div className="success-message" data-testid="delegate-scanner-success">{success}</div>}

      <div className="scanner-preview" data-testid="delegate-scanner-preview">
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', display: scanning ? 'block' : 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="scanner-controls">
        {!scanning ? (
          <button onClick={startScanning} className="btn-primary" data-testid="delegate-scanner-start-btn">
            Iniciar Cámara
          </button>
        ) : (
          <button onClick={stopScanning} className="btn-secondary" data-testid="delegate-scanner-stop-btn">
            Detener Cámara
          </button>
        )}
      </div>

      <div className="manual-input" data-testid="delegate-scanner-manual">
        <h3>O ingresa el código manualmente:</h3>
        <form onSubmit={handleManualInput}>
          <input
            type="text"
            name="token"
            placeholder="Código QR"
            data-testid="delegate-scanner-input"
          />
          <button type="submit" className="btn-primary" data-testid="delegate-scanner-submit-btn">
            Activar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DelegateScanner;