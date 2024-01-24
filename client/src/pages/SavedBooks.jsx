import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook, saveBook } from '../utils/API';
import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries'; 
import { REMOVE_BOOK } from '../utils/mutations';
import { saveBookIds, getSavedBookIds, removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const userData = data?.me || {};

  // Ensure savedBooks is always an array
  const savedBooks = userData.savedBooks || [];


 // Initialize REMOVE_BOOK mutation
 const [removeBook] = useMutation(REMOVE_BOOK, {
  update(cache, { data: { removeBook } }) {
    cache.modify({
      fields: {
        me(existingMe = {}) {
          return removeBook;
        }
      }
    });
  }
});

    // Function to handle deleting a book
    const handleDeleteBook = async (bookId) => {
      try {
        await removeBook({
          variables: { bookId }
        });
        // upon success, remove book's id from localStorage
        removeBookId(bookId);
      } catch (err) {
        console.error(err);
      }
    };

    if (loading) {
      return <h2>LOADING...</h2>;
    }
  
    if (error || !userData) {
      return <h2>Error loading books or no books available.</h2>;
    }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;