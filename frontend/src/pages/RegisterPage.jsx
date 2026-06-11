import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5074/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const msg = await response.text();
        setError(msg || 'Błąd rejestracji.');
      }
    } catch (error) {
      setError('Brak połączenia z serwerem.', error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4"><i className="bi bi-person-plus text-primary me-2"></i>Rejestracja</h3>
          {success && <Alert variant="success">Konto utworzone! Przekierowanie do logowania...</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="np. student@pwr.pl" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Hasło</Form.Label>
              <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="min. 6 znaków" />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100 fw-bold mb-3">Stwórz konto</Button>
          </Form>
          <div className="text-center">
            <small className="text-muted">Masz już konto? <Link to="/login">Zaloguj się</Link></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;