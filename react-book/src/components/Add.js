import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { v4 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';

function Add() {
  const [showModal, setShowModal] = useState(true); // Set to true to open the modal initially
  const [BookName, setName] = useState("");
  const [AuthorName, setAuthor] = useState("");
  const history = useNavigate();

  useEffect(() => {
    handleShow(); // Automatically open the modal when the component is rendered
  }, []); // Empty dependency array to run only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!BookName || !AuthorName) {
      console.error("Book Name and Author Name are required.");
      return;
    }

    // Assuming you have an API endpoint for adding books
    const apiUrl = "http://localhost:5210/api/Book";

    try {
      const response = await axios.post(apiUrl, { BookName, AuthorName });
      console.log("Response:", response);

      if (response.status === 200) {
        // Assuming the API returns a unique identifier for the new book
        const uniqueId = response.data.bookId || uuid().slice(0, 8);
        handleClose();
        history("/");
      } else {
        console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  }

  const handleCancel = () => {
    handleClose();
    history("/");
  }

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
     

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Control type="text" placeholder="Enter Book Name" required onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAuthor">
              <Form.Control type="text" placeholder="Enter Author Name" required onChange={(e) => setAuthor(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Add;
