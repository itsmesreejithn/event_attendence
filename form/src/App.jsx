import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Container, Button, Alert, Row, Col } from "react-bootstrap";
import ListEvents from "./components/ListEvents";
import ListParticipants from "./components/ListParticipants";
import { useRecoilValue } from "recoil";
import { eventIdState, participantsState } from "./atom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect, useState } from "react";
import axios from "axios";
import URL from "../url";

function App() {
  const globalTime = new Date();
  const eventId = parseInt(useRecoilValue(eventIdState));
  const participants = useRecoilValue(participantsState);
  const [showAlert, setShowAlert] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    `${globalTime.getHours()}:${globalTime.getMinutes()}:${globalTime.getSeconds()}`
  );

  useEffect(() => {
    const updateTime = () => {
      const newTime = new Date();
      setTime(
        `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`
      );
    };
    const updateDate = () => {
      setDate(new Date());
    };

    const timeIntervalId = setInterval(updateTime, 1000 * 60 * 60);
    const dateIntervalId = setInterval(updateDate, 1000 * 60 * 60 * 24);

    return () => {
      clearInterval(timeIntervalId);
      clearInterval(dateIntervalId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedParticipants = JSON.parse(participants);
      const participantsArray = parsedParticipants.map((participant) => ({
        participantId: parseInt(participant.participantId),
      }));
      const [hours, minutes] = time.split(":");
      console.log(`${hours}:${minutes}`);
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = `${hours}:${minutes}:00`;
      console.log(formattedTime);
      if (!eventId || !participantsArray) {
        throw Error("no event and prticipants selected");
      }
      const response = await axios.post(`${URL}/analytics/`, {
        eventId: eventId,
        participants: participantsArray,
        date: formattedDate,
        time: formattedTime,
      });
      if (response) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  };

  return (
    <Container>
      {showAlert ? (
        <Alert
          variant="success"
          // onClose={() => setShowAlert(false)}
          // dismissible
        >
          <Alert.Heading>The data submitted successfully</Alert.Heading>
        </Alert>
      ) : (
        <></>
      )}
      <p className="text-center text-uppercase mt-2 h1">Add Events</p>
      <Row className="my-3">
        <Col>
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
        </Col>
        <Col className="d-flex justify-content-end">
          <TimePicker onChange={setTime} value={time} format="HH:mm:ss" />
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className="my-2">
          <Col>
            <Row className="my-5">
              <ListEvents />
            </Row>
            <Row>
              <ListParticipants />
            </Row>
          </Col>
          <Row className="my-2">
            <Col className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="w-25">
                Submit
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Container>
  );
}

export default App;
