import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const authHeader = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    fetch('http://localhost:5074/api/transactions', { headers: authHeader })
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error(error));

    fetch('http://localhost:5074/api/accounts', { headers: authHeader })
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error(error));

    fetch('http://localhost:5074/api/exchangerates')
      .then(response => response.json())
      .then(data => setRates(data))
      .catch(error => console.error(error));
  }, []);

  const income = transactions
    .filter(t => t.category?.type === 'Przychód')
    .reduce((acc, t) => acc + (t.currencyCode === 'PLN' ? t.amount : t.amountInPln), 0);

  const expense = transactions
    .filter(t => t.category?.type === 'Wydatek')
    .reduce((acc, t) => acc + (t.currencyCode === 'PLN' ? t.amount : t.amountInPln), 0);

  const totalBalanceInPln = accounts.reduce((acc, account) => {
    if (account.currencyCode === 'PLN') {
      return acc + account.currentBalance;
    } else {
      const rateObj = rates.find(r => r.currencyCode === account.currencyCode);
      const currentRate = rateObj ? rateObj.rate : 1;
      return acc + (account.currentBalance * currentRate);
    }
  }, 0);

  const expenseByCategory = transactions
    .filter(t => t.category?.type === 'Wydatek')
    .reduce((acc, t) => {
      const catName = t.category?.name || 'Ogólne';
      const amt = t.currencyCode === 'PLN' ? t.amount : t.amountInPln;
      acc[catName] = (acc[catName] || 0) + amt;
      return acc;
    }, {});

  const reportData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key],
    percentage: expense > 0 ? (expenseByCategory[key] / expense) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const VARIANTS = ['primary', 'danger', 'warning', 'success', 'info', 'dark'];

  return (
    <Container>
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="shadow-sm border-0 border-start border-success border-4">
            <Card.Body>
              <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.85rem' }}>Przychody</p>
              <h3 className="mb-0 text-success"><i className="bi bi-arrow-up-circle me-2"></i>{income.toFixed(2)} PLN</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="shadow-sm border-0 border-start border-danger border-4">
            <Card.Body>
              <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.85rem' }}>Wydatki</p>
              <h3 className="mb-0 text-danger"><i className="bi bi-arrow-down-circle me-2"></i>{expense.toFixed(2)} PLN</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className={`shadow-sm border-0 border-start border-4 ${totalBalanceInPln >= 0 ? 'border-primary' : 'border-warning'}`}>
            <Card.Body>
              <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.85rem' }}>Stan Konta (Razem)</p>
              <h3 className={`mb-0 ${totalBalanceInPln >= 0 ? 'text-primary' : 'text-warning'}`}>
                <i className="bi bi-bank me-2"></i>{totalBalanceInPln.toFixed(2)} PLN
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4"><i className="bi bi-bar-chart-line me-2"></i>Struktura wydatków według kategorii</Card.Title>
              {reportData.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <p>Brak wydatków do wyświetlenia raportu.</p>
                </div>
              ) : (
                <div className="py-2">
                  {reportData.map((item, index) => (
                    <div key={item.name} className="mb-4">
                      <div className="d-flex justify-content-between mb-1 fw-semibold">
                        <span>{item.name}</span>
                        <span className="text-muted">{item.value.toFixed(2)} PLN ({item.percentage.toFixed(0)}%)</span>
                      </div>
                      <ProgressBar 
                        now={item.percentage} 
                        variant={VARIANTS[index % VARIANTS.length]} 
                        style={{ height: '12px' }}
                        className="rounded-pill"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-3 text-secondary">
                <i className="bi bi-currency-exchange me-2"></i>Kursy walut (NBP)
              </Card.Title>
              
              {rates.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Pobieranie...
                </div>
              ) : (
                <Table borderless hover size="sm" className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Waluta</th>
                      <th className="text-end">Kurs (PLN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map(rate => (
                      <tr key={rate.id} className="border-bottom">
                        <td className="fw-bold">{rate.currencyCode}</td>
                        <td className="text-end">{rate.rate.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <div className="text-end mt-3">
                <small className="text-muted">Źródło danych: api.nbp.pl</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;