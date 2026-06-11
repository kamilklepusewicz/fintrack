import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import ExchangeRatesPage from './pages/ExchangeRatesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const handleLogin = (userToken, email) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('userEmail', email);
    setToken(userToken);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken('');
    setUserEmail('');
  };

  return (
    <Router>
      {token && (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <i className="bi bi-wallet2 text-primary me-2"></i>FinTrack
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/accounts">Konta</Nav.Link>
                <Nav.Link as={Link} to="/categories">Kategorie</Nav.Link>
                <Nav.Link as={Link} to="/transactions">Transakcje</Nav.Link>
                <Nav.Link as={Link} to="/nbp">Kursy NBP</Nav.Link>
              </Nav>
              <Navbar.Text className="me-3">
                Zalogowany jako: <strong className="text-white">{userEmail}</strong>
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Wyloguj
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Routes>
        <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={token ? <AccountsPage /> : <Navigate to="/login" />} />
        <Route path="/categories" element={token ? <CategoriesPage /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={token ? <TransactionsPage /> : <Navigate to="/login" />} />
        <Route path="/nbp" element={token ? <ExchangeRatesPage /> : <Navigate to="/login" />} />
        
        <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;