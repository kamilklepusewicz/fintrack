import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Wydatek');
  const [refresh, setRefresh] = useState(0);

  const API_URL = 'http://localhost:5074/api/categories';

  useEffect(() => {
    fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, type })
      });
      if (response.ok) {
        setRefresh(prev => prev + 1);
        setName('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setRefresh(prev => prev + 1);
      } else {
        alert("Nie możesz usunąć domyślnej kategorii systemowej!");
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
              <Card.Title className="mb-4"><i className="bi bi-tags me-2"></i>Dodaj kategorię</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nazwa kategorii</Form.Label>
                  <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="np. Zdrowie, Auto" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Typ transakcji</Form.Label>
                  <Form.Select value={type} onChange={e => setType(e.target.value)}>
                    <option value="Wydatek">Wydatek</option>
                    <option value="Przychód">Przychód</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-bold">Zapisz</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4"><i className="bi bi-grid-3x3-gap me-2"></i>Kategorie transakcji</Card.Title>
              <Table borderless hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nazwa kategorii</th>
                    <th>Typ</th>
                    <th className="text-center">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="border-bottom">
                      <td className="fw-medium">{c.name}</td>
                      <td>
                        <Badge bg={c.type === 'Przychód' ? 'success' : 'danger'} className="bg-opacity-75">
                          {c.type}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {c.userId ? (
                          <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(c.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}><i className="bi bi-lock-fill me-1"></i>Systemowa</span>
                        )}
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

export default CategoriesPage;