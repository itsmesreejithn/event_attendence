import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../url";
import {
  Card,
  Col,
  Row,
  InputGroup,
  ListGroup,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useRecoilState } from "recoil";
import { participantsState } from "../atom";

const ListParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [participantState, setParticipantState] =
    useRecoilState(participantsState);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantId, setParticipantId] = useState(null);

  const handleShowAddParticipant = () => setShowAddParticipant(true);
  const handleClose = () => {
    setShowAddParticipant(false);
  };

  const submitParticipant = async () => {
    try {
      const response = await axios.post(`${URL}/participants/`, {
        participantId,
        participantName,
      });
      if (response) setShowAddParticipant(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleParticipantIdChange = (e) => {
    setParticipantId(parseInt(e.target.value, 10));
  };
  const handleParticipantNameChange = (e) => {
    setParticipantName(e.target.value);
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data: response } = await axios.get(`${URL}/participants`);
        setParticipants(response.data.participants);
      } catch (error) {
        console.error(error);
      }
    };
    fetchParticipants();
  }, [submitParticipant]);

  const handleCheckboxChange = (participantId) => {
    setSelectedParticipants((prevSelected) => {
      if (prevSelected[participantId]) {
        const { [participantId]: omit, ...rest } = prevSelected;
        return rest;
      } else {
        return { ...prevSelected, [participantId]: true };
      }
    });
  };

  const handleAllCheckboxChange = () => {
    const newSelected = {};
    if (!selectAll) {
      participants.forEach((participant) => {
        newSelected[participant.participantId] = true;
      });
    }
    setSelectedParticipants(newSelected);
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const selectedParticipantsArray = Object.keys(selectedParticipants).map(
      (participantId) => ({
        participantId,
      })
    );
    setParticipantState(JSON.stringify(selectedParticipantsArray));
  }, [selectedParticipants]);

  return (
    <>
      <Col lg="2">
        <p className="h3">Attendees</p>
      </Col>
      <Col lg="2">
        <Button onClick={handleShowAddParticipant} className="w-25">
          +
        </Button>
      </Col>
      <Col>
        <ListGroup
          className="w-100 text-center"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <ListGroup.Item>
            <Form.Check
              aria-label="Checkbox to select all"
              checked={selectAll}
              onChange={handleAllCheckboxChange}
              label="select all"
            />
          </ListGroup.Item>
          {participants.map((participant) => (
            <ListGroup.Item className="my-2">
              <Form.Check
                aria-label="Checkbox for selecting participants"
                key={participant.participantId}
                id={participant.participantId}
                checked={
                  selectedParticipants[participant.participantId] || false
                }
                onChange={() => handleCheckboxChange(participant.participantId)}
                label={participant.participantName}
                style={{ cursor: "pointer" }}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      <Modal
        show={showAddParticipant}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new participant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="participant id">Participant Id</Form.Label>
          <Form.Control
            type="number"
            id="participantId"
            placeholder="Enter participantId"
            onChange={handleParticipantIdChange}
          />
          <br />
          <Form.Label htmlFor="participant Name">Participant name</Form.Label>
          <Form.Control
            type="text"
            id="participantName"
            placeholder="Enter participant name"
            onChange={handleParticipantNameChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitParticipant}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListParticipants;
