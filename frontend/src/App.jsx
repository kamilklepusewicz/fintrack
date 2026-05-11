import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';

function App() {
  const [transactions, setTransactions] = useState([]);

  return (
    <Container className="mt-4">
      <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
        <h1>💰 FinTrack</h1>
        <span className="text-muted">Zalogowany jako: <strong>User</strong></span>
      </header>

      <Row>
        {/* Lewa kolumna - Formularz */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Dodaj transakcję</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Kwota (PLN)</Form.Label>
                  <Form.Control type="number" step="0.01" placeholder="np. 50.00" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Kategoria</Form.Label>
                  <Form.Select>
                    <option>Wypłata</option>
                    <option>Jedzenie</option>
                    <option>Transport</option>
                    <option>Rachunki</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Opis</Form.Label>
                  <Form.Control type="text" placeholder="np. Zakupy w markecie" />
                </Form.Group>
                
                <Button variant="primary" type="submit" className="w-100">
                  Zapisz
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Prawa kolumna - Tabela z historią */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Historia transakcji</Card.Title>
              {transactions.length === 0 ? (
                <div className="text-center text-muted my-5">
                  <p>Brak transakcji. Dodaj swój pierwszy wydatek lub przychód!</p>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Opis</th>
                      <th>Kategoria</th>
                      <th>Kwota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* W przyszłości tu będą generowane wiersze (<tr>) na podstawie danych z bazy */}
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

export default App;