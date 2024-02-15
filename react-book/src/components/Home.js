import React, { Fragment, useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


function Home() {
  const [book, setBook] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [BookName, setBookName] = useState("");
  const [AuthorName, setAuthorName] = useState("");
  const [isDataChanged, setIsDataChanged] = useState(false);
 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5210/api/Book");
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  useEffect(() => {
    // Call fetchData when the component mounts
    fetchData();
  }, []); 
  
  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5210/api/Book/${bookId}`);
      setBook((prevBook) => prevBook.filter(item => item.bookId !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  }

  const handleEdit = (bookId) => {
    const selectedBook = book.find(item => item.bookId === bookId);
    setSelectedBookId(bookId);
    setBookName(selectedBook.bookName);
    setAuthorName(selectedBook.authorName);
    setIsDataChanged(false); // Reset isDataChanged when the edit modal is opened
    setShowEditModal(true);
  }

  const handleInputChange = (e) => {
    // Update input values and set isDataChanged to true
    const { name, value } = e.target;
    if (name === 'BookName') {
      setBookName(value);
    } else if (name === 'AuthorName') {
      setAuthorName(value);
    }
    setIsDataChanged(true);
  };

  const handleEditSubmit = async () => {

    try {

      if (!/^\D+$/.test(AuthorName)) {
        console.error("Author Name should not contain numbers.");
        return;
      }
      await axios.put(`http://localhost:5210/api/Book/${selectedBookId}`, { bookName: BookName, authorName: AuthorName });
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  }

  const handleCancel = () => {
    handleClose();
    // Reset form values
    setBookName("");
    setAuthorName("");
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!BookName || !AuthorName) {
      console.error("Book Name and Author Name are required.");
      return;
    }

    if (!/^\D+$/.test(AuthorName)) {
      console.error("Author Name should not contain numbers.");
      return;
    }

    const apiUrl = "http://localhost:5210/api/Book";
  
    try {
      const response = await axios.post(apiUrl, { BookName, AuthorName });
      console.log("Response:", response);
  
      if (response.status === 200) {
        handleClose();
        await fetchData();
        // Reset form values
        setBookName("");
        setAuthorName("");
      } else {
        console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  }
  

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedBookId(null);
    setBookName("");
    setAuthorName("");
  }

  return (
    <Fragment>
      <div style={{ margin: "7rem" }}>
        <h2 style={{ marginBottom: "10px" }}>Book Dashboard</h2>
        <Button size="sm" variant="primary" style={{ marginBottom: "15px" }} onClick={handleShow} className="float-end">
          Add Book
        </Button>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              book && book.length > 0
                ? book.map((item) => (
                  <tr key={item.bookId}>
                    <td>{item.bookName}</td>
                    <td>{item.authorName}</td>
                    <td>
                      <Button onClick={() => handleEdit(item.bookId)} variant="info" style={{ marginRight: "5px" }}>Edit</Button>
                      <Button onClick={() => handleDelete(item.bookId)} variant="primary"style={{ background: "red" }} >Delete</Button>
                    </td>
                  </tr>
                ))
                : <tr>
                  <td colSpan="3">No data available</td>
                </tr>
            }
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Control type="text" placeholder="Enter Book Name" required maxLength="50" onChange={(e) => setBookName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAuthor">
              <Form.Control type="text" placeholder="Enter Author Name" required maxLength="50" pattern="^[^0-9]+$" onChange={(e) => setAuthorName(e.target.value)} />
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

     <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formEditName">
              <Form.Control
                type="text"
                placeholder="Edit Book Name"
                name="BookName"
                value={BookName}
                required
                maxLength="50"
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEditAuthor">
              <Form.Control
                type="text"
                placeholder="Edit Author Name"
                name="AuthorName"
                value={AuthorName}
                required
                maxLength="50"
                pattern="^[^0-9]+$"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit} disabled={!isDataChanged}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default Home;