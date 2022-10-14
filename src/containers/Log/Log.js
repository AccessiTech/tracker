import React from "react";
import { Button, Card, Container, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLog } from "../../store/Log";
import "./log.scss";

function Log() {
  const navigate = useNavigate();
  const { id } = useParams();
  const log = useGetLog(id);
  const { name, entries, fields } = log;

  return (
    <Container className="log__container">
      <Row>
        <Col>
          <h1>{name}</h1>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="log__entries">
          <h4>Entries</h4>
          {entries && Object.values(entries).length ? (
            Object.values(entries)
              .filter((entry) => entry && Object.keys(entry).length > 2)
              .map((entry) => {
                return (
                  <Card key={id + "-" + entry.id} className="log__entry">
                    <Card.Body>
                      {Object.keys(entry)
                        .filter((fieldId) => fields[fieldId])
                        .map((fieldId) => {
                          return (
                            <div
                              key={id + "-" + fieldId}
                              className="log__entry__field"
                            >
                              <strong>{fields[fieldId].name}</strong>:{" "}
                              {entry[fieldId]}
                            </div>
                          );
                        })}
                    </Card.Body>
                  </Card>
                );
              })
          ) : (
            <p>No entries</p>
          )}
        </Col>
      </Row>
      <hr />
      <Row className="form__log__button_row">
        <Col>
          <Button
            variant="dark"
            onClick={() => {
              navigate(`/`);
            }}
          >
            Back
          </Button>
        </Col>
        <Col>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/log/${id}/edit`);
            }}
          >
            Edit Log
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={() => navigate(`/log/${id}/entry`)}
          >
            Add Entry
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Log;
