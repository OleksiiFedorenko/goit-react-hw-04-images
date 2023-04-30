import { useState, useEffect } from 'react';
import { Container } from './App.styled';
import fetchImages from 'services/GalleryService';
import Searchbar from 'components/Searchbar/Searchbar';
import Loader from 'components/Loader/Loader';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import TextWarning from 'components/TextWarning/TextWarning';
import Modal from 'components/Modal/Modal';

const App = () => {
  const [{ status, message }, setState] = useState({
    status: 'idle',
    message: 'Please let us know what you want to find',
  });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    imageUrl: '',
    imageAlt: '',
  });

  useEffect(() => {
    async function getImages(searchQuery, page) {
      setState({ status: 'pending', message: '' });
      try {
        const { totalHits, hits } = await fetchImages(searchQuery, page);

        if (!totalHits) {
          setState({
            status: 'rejected',
            message: 'No images found, please try different query',
          });
          return;
        }

        const totalPages = Math.ceil(totalHits / 12);
        const imageArray = collectNeededData(hits);

        setState({
          status: 'resolved',
          message: page === totalPages ? `That's it. Keep searching!` : '',
        });
        setImages(prevImages => [...prevImages, ...imageArray]);
        setTotalPages(totalPages);
      } catch (error) {
        setState({
          status: 'rejected',
          message: 'Something went wrong. Please try again.',
        });
      }
    }

    if (query !== '') getImages(query, page);
  }, [query, page]);

  function onSubmit(searchQuery) {
    if (!searchQuery) {
      setState({
        status: 'rejected',
        message: 'You searched nothing, please specify your query',
      });
      return;
    }
    if (searchQuery === query) return;

    setImages([]);
    setPage(1);
    setQuery(searchQuery);
  }

  function onLoadMore() {
    setPage(prevPage => prevPage + 1);
  }

  function openModal(imageUrl, imageAlt) {
    setModal({ isOpen: true, imageUrl, imageAlt });
  }

  function closeModal() {
    setModal({ isOpen: false, imageUrl: '', imageAlt: '' });
  }

  function collectNeededData(fetchedArray) {
    return fetchedArray.map(({ id, largeImageURL, webformatURL, tags }) => ({
      id,
      largeImageURL,
      webformatURL,
      tags,
    }));
  }

  return (
    <Container>
      <Searchbar onSubmit={onSubmit} />

      {(status === 'resolved' ||
        (status === 'pending' && images.length !== 0)) && (
        <ImageGallery images={images} onImageClick={openModal} />
      )}

      {status === 'pending' && <Loader />}

      {status === 'resolved' && page !== totalPages && (
        <Button onLoadMore={onLoadMore} />
      )}

      {(status === 'idle' ||
        status === 'rejected' ||
        (status === 'resolved' && page === totalPages)) && (
        <TextWarning message={message} />
      )}

      {modal.isOpen && <Modal image={modal} onClose={closeModal} />}
    </Container>
  );
};

export default App;
