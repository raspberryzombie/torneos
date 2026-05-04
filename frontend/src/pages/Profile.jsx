import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState('');
  const [level, setLevel] = useState(5);
  const [preferredHand, setPreferredHand] = useState('right');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLevel(user.level || 5);
      setPreferredHand(user.preferred_hand || 'right');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    const success = await updateProfile({
      name,
      level,
      preferred_hand: preferredHand,
    });
    
    setLoading(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photo_url ? (
              <img src={user.photo_url} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <p className="profile-email">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              data-testid="profile-name"
            />
          </div>

          <div className="form-group">
            <label>Nivel (1-10)</label>
            <div className="level-selector" data-testid="profile-level">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`level-btn ${level === l ? 'active' : ''}`}
                  onClick={() => setLevel(l)}
                  data-testid={`level-${l}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Mano preferida</label>
            <div className="hand-toggle" data-testid="profile-hand">
              <button
                type="button"
                className={`hand-btn ${preferredHand === 'left' ? 'active' : ''}`}
                onClick={() => setPreferredHand('left')}
                data-testid="hand-left"
              >
                Zurda
              </button>
              <button
                type="button"
                className={`hand-btn ${preferredHand === 'right' ? 'active' : ''}`}
                onClick={() => setPreferredHand('right')}
                data-testid="hand-right"
              >
                Derecha
              </button>
            </div>
          </div>

          {success && <div className="success-message">Cambios guardados</div>}

          <button type="submit" className="btn-primary" disabled={loading} data-testid="profile-save">
            {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
          </button>
        </form>

        <div className="profile-footer">
          <p>Miembro desde: {formatDate(user.created_at)}</p>
          <button onClick={handleLogout} className="btn-logout" data-testid="profile-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;