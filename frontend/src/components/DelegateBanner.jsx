import { useAuth } from '../contexts/AuthContext';

const DelegateBanner = () => {
  const { delegateSession, deactivateDelegate } = useAuth();

  if (!delegateSession) return null;

  return (
    <div className="delegate-banner" data-testid="delegate-banner">
      <div className="delegate-banner-content">
        <span className="delegate-banner-icon">🔒</span>
        <span className="delegate-banner-text" data-testid="delegate-banner-text">
          Modo Editor - Permisos limitados
        </span>
        <button
          className="delegate-banner-btn"
          onClick={deactivateDelegate}
          data-testid="delegate-banner-exit-btn"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default DelegateBanner;