import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../url";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { eventIdState } from "../atom";

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [eventState, setEventState] = useRecoilState(eventIdState);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventName, setEventName] = useState("");

  const handleShowCreateEvent = () => setShowCreateEvent(true);
  const handleClose = () => {
    setShowCreateEvent(false);
  };

  const submitEventName = async () => {
    try {
      const response = await axios.post(`${URL}/events/`, {
        eventName: eventName,
      });
      if (response) {
        setShowCreateEvent(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: response } = await axios.get(`${URL}/events`);
        setEvents(response.data.events);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventChange = (e) => {
    setEventState(e.target.value);
  };

  return (
    <>
      <Col lg="2">
        <p className="h3">Event Name</p>
      </Col>
      <Col>
        <Form.Select
          aria-label="Select event"
          onChange={handleEventChange}
          value={eventState}
        >
          <option>--Select any one --</option>
          {events.map((event) => (
            <option
              key={event.eventId}
              value={event.eventId}
            >{`${event.eventName}: ${event.category}`}</option>
          ))}
        </Form.Select>
      </Col>
      <Col>
        <Row>
          <Col className="d-flex justify-content-end">
            <p className="h4">Add Event</p>
          </Col>
          <Col>
            <Button className="w-25" onClick={handleShowCreateEvent}>
              +
            </Button>
          </Col>
        </Row>
      </Col>
      <Modal
        show={showCreateEvent}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="event name">Event Name</Form.Label>
          <Form.Control
            type="text"
            id="eventName"
            placeholder="Enter event name"
            onChange={handleEventNameChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitEventName}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListEvents;
