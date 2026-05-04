import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './CreateTournament.css';

const CreateTournament = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    address: '',
    start_date: '',
    end_date: '',
    category: '',
    format: '',
    capacity: 16,
    entry_fee: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        capacity: parseInt(formData.capacity),
        entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
      };
      
      await api.post('/api/tournaments', data);
      navigate('/my-tournaments');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el torneo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-tournament-container">
      <header className="create-header">
        <Link to="/my-tournaments" className="back-btn">←</Link>
        <h1>Crear Torneo</h1>
        <div style={{ width: 40 }}></div>
      </header>

      <form onSubmit={handleSubmit} className="create-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Nombre del Torneo *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Torneo de Verano 2026"
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detalles del torneo..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Club / Sede *</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            placeholder="Club de Tennis"
          />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Av. Principal 123"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha Inicio *</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha Fin *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoría</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="open">Open</option>
            </select>
          </div>
          <div className="form-group">
            <label>Formato</label>
            <select name="format" value={formData.format} onChange={handleChange}>
              <option value="">Seleccionar</option>
              <option value="singles">Singles</option>
              <option value="dobles">Dobles</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cupo *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min={2}
              max={128}
            />
          </div>
          <div className="form-group">
            <label>Inscripción ($)</label>
            <input
              type="number"
              name="entry_fee"
              value={formData.entry_fee}
              onChange={handleChange}
              placeholder="0"
              min={0}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Torneo'}
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;