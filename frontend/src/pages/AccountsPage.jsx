import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Konto bankowe');
  const [refresh, setRefresh] = useState(0);

  const API_URL = 'http://localhost:5074/api/accounts';

  useEffect(() => {
    fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error(error));
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAccount = { name, currencyCode: currency, initialBalance: parseFloat(balance), type };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAccount)
      });
      if (response.ok) {
        setRefresh(prev => prev + 1);
        setName('');
        setBalance('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Czy na pewno chcesz usunąć to konto? Wszystkie powiązane z nim transakcje zostaną skasowane!")) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) setRefresh(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4"><i className="bi bi-bank me-2"></i>Dodaj konto</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nazwa konta</Form.Label>
                  <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="np. mBank" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Saldo początkowe</Form.Label>
                  <Form.Control type="number" step="0.01" required value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0.00" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Waluta</Form.Label>
                  <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="PLN">PLN</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="CHF">CHF</option>
                    <option value="GBP">GBP</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Typ konta</Form.Label>
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Konto bankowe">Konto bankowe</option>
                    <option value="Gotówka">Gotówka</option>
                    <option value="Oszczędności">Oszczędności</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-bold">Zapisz konto</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4"><i className="bi bi-credit-card-2-front me-2"></i>Twoje konta</Card.Title>
              <Table borderless hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nazwa</th>
                    <th>Typ</th>
                    <th className="text-end">Saldo</th>
                    <th className="text-center">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.id} className="border-bottom">
                      <td className="fw-medium">{acc.name}</td>
                      <td className="text-muted">{acc.type}</td>
                      <td className="text-end fw-bold">{acc.currentBalance.toFixed(2)} {acc.currencyCode}</td>
                      <td className="text-center">
                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(acc.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AccountsPage;