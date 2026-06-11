import { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col } from 'react-bootstrap';

function ExchangeRatesPage() {
  const [currency, setCurrency] = useState('EUR');
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5074/api/exchangerates/history/${currency}`)
      .then(response => response.json())
      .then(data => setHistoryData(data))
      .catch(error => console.error(error));
  }, [currency]);

  const rates = historyData?.rates || [];
  const midValues = rates.map(r => r.mid);
  const minMid = midValues.length > 0 ? Math.min(...midValues) * 0.999 : 0;
  const maxMid = midValues.length > 0 ? Math.max(...midValues) * 1.001 : 0;

  return (
    <Container>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <Card.Title className="mb-0">
                <i className="bi bi-graph-up-arrow text-primary me-2"></i>Historia kursu waluty (Ostatnie 30 dni)
              </Card.Title>
            </Col>
            <Col md={6} className="text-end">
              <Form.Group className="d-inline-block text-start" style={{ width: '200px' }}>
                <Form.Label><small className="text-muted fw-bold">Wybierz walutę:</small></Form.Label>
                <Form.Select size="sm" value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dolar amerykański)</option>
                  <option value="CHF">CHF (Frank szwajcarski)</option>
                  <option value="GBP">GBP (Funt brytyjski)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {rates.length === 0 ? (
            <div className="text-center text-muted py-5">Ładowanie wykresu z API NBP...</div>
          ) : (
            <div className="pt-2">
              <div className="d-flex justify-content-between bg-light border rounded p-4 mb-5 shadow-inner" style={{ height: '320px' }}>
                {rates.map((rate, idx) => {
                  const heightPercentage = maxMid !== minMid ? ((rate.mid - minMid) / (maxMid - minMid)) * 75 + 15 : 100;
                  return (
                    <div key={idx} className="d-flex flex-column justify-content-end align-items-center flex-grow-1 mx-1 position-relative" style={{ height: '100%', minWidth: '0' }}>
                      
                      <div className="w-100 bg-primary bg-gradient rounded-top position-relative bar-hover" 
                           style={{ 
                             height: `${heightPercentage}%`, 
                             transition: 'height 0.3s ease',
                             cursor: 'pointer' 
                           }}
                           title={`Data: ${rate.effectiveDate}\nKurs: ${rate.mid.toFixed(4)} PLN`}
                      >
                        <div className="position-absolute bg-dark text-white rounded p-1 text-center font-monospace shadow-sm" 
                             style={{ fontSize: '0.65rem', bottom: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '45px' }}>
                          {rate.mid.toFixed(2)}
                        </div>
                      </div>
                      
                      <span className="text-muted d-none d-md-block position-absolute" style={{ fontSize: '0.55rem', transform: 'rotate(-45deg)', bottom: '-35px', whiteSpace: 'nowrap' }}>
                        {rate.effectiveDate.substring(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-muted">
                <small><i className="bi bi-info-circle me-1"></i>Wykres prezentuje poprawny trend. Wyższy słupek oznacza wyższą cenę waluty w PLN.</small>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ExchangeRatesPage;