import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, Badge } from 'react-bootstrap';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [refresh, setRefresh] = useState(0);

  const API_URL = 'http://localhost:5074/api/transactions';
  const CAT_URL = 'http://localhost:5074/api/categories';
  const ACC_URL = 'http://localhost:5074/api/accounts';

  useEffect(() => {
    const authHeader = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    fetch(API_URL, { headers: authHeader })
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error(error));

    fetch(CAT_URL, { headers: authHeader })
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id);
      })
      .catch(error => console.error(error));

    fetch(ACC_URL, { headers: authHeader })
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0].id);
      })
      .catch(error => console.error(error));
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCatObj = categories.find(c => c.id === parseInt(selectedCategory));

    const newTransaction = {
      amount: parseFloat(amount),
      description: description,
      date: new Date().toISOString(),
      categoryId: parseInt(selectedCategory),
      accountId: parseInt(selectedAccount),
      currencyCode: currency,
      type: selectedCatObj ? selectedCatObj.type : 'Wydatek'
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTransaction)
      });

      if (response.ok) {
        setRefresh(prev => prev + 1);
        setAmount('');
        setDescription('');
        setCurrency('PLN');
      }
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
              <Card.Title className="mb-4">
                <i className="bi bi-plus-circle-dotted me-2"></i>Dodaj transakcję
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Kwota</Form.Label>
                  <Form.Control
                    type="number" step="0.01" required
                    value={amount} onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
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

                <Form.Group className="mb-3">
                  <Form.Label>Z konta / Na konto</Form.Label>
                  <Form.Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.currencyCode})</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kategoria</Form.Label>
                  <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Opis</Form.Label>
                  <Form.Control
                    type="text" required
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="np. Zakupy w Lidlu"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 fw-bold">
                  <i className="bi bi-check2-circle me-2"></i>Zapisz
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4">
                <i className="bi bi-clock-history me-2"></i>Historia transakcji
              </Card.Title>
              {transactions.length === 0 ? (
                <div className="text-center text-muted my-5">
                  <i className="bi bi-receipt display-4 d-block mb-3 opacity-50"></i>
                  <p>Brak transakcji.</p>
                </div>
              ) : (
                <Table borderless hover responsive className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Data</th>
                      <th>Opis</th>
                      <th>Konto</th>
                      <th>Kategoria</th>
                      <th className="text-end">Kwota</th>
                      <th className="text-end">Wartość w PLN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => {
                      const isIncome = t.category?.type === 'Przychód';
                      return (
                        <tr key={t.id} className="border-bottom">
                          <td className="text-muted"><small>{new Date(t.date).toLocaleDateString()}</small></td>
                          <td className="fw-medium">{t.description}</td>
                          <td className="text-secondary"><small><i className="bi bi-credit-card me-1"></i>{t.account?.name || 'Nieznane'}</small></td>
                          <td>
                            <Badge bg={isIncome ? 'success' : 'danger'} className="bg-opacity-75 rounded-pill px-3 py-2">
                              {t.category ? t.category.name : 'Ogólne'}
                            </Badge>
                          </td>
                          <td className={`text-end fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                            {isIncome ? '+' : '-'} {t.amount.toFixed(2)} {t.currencyCode}
                          </td>
                          <td className="text-end text-muted fw-semibold">
                            {t.currencyCode !== 'PLN' ? `${t.amountInPln.toFixed(2)} PLN` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TransactionsPage;