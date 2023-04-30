import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ImageContainer } from './Modal.styled';

const Modal = ({ image, onClose }) => {
  useEffect(() => {
    function handleEscClosing(e) {
      if (e.code === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEscClosing);
    return () => {
      window.removeEventListener('keydown', handleEscClosing);
    };
  }, [onClose]);

  function handleClickClosing(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <Overlay onClick={handleClickClosing}>
      <ImageContainer>
        <img src={image.imageUrl} alt={image.imageAlt} />
      </ImageContainer>
    </Overlay>
  );
};

Modal.propTypes = {
  image: PropTypes.exact({
    isOpen: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
