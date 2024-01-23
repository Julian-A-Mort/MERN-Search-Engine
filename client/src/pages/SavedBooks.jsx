import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.modify({
        fields: {
          me(existingMeData) {
            return removeBook;
          },
        },
      });
    }
  });

  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data?.me;

  return (
    <Container fluid className="text-light bg-dark p-5">
      <h1>Viewing saved books!</h1>
      <Row>
        {userData.savedBooks.map((book) => (
          <Col md="4" key={book.bookId}>
            <Card border='dark'>
              {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors.join(', ')}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
