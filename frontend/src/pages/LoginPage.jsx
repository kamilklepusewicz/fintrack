import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5074/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token, data.email);
        navigate('/');
      } else {
        const msg = await response.text();
        setError(msg || 'Błędny e-mail lub hasło.');
      }
    } catch (error) {
      setError('Brak połączenia z serwerem.', error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4"><i className="bi bi-shield-lock text-primary me-2"></i>Zaloguj się</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="user@test.pl" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Hasło</Form.Label>
              <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold mb-3">Zaloguj</Button>
          </Form>
          <div className="text-center">
            <small className="text-muted">Nie masz konta? <Link to="/register">Zarejestruj się</Link></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;