import React from 'react';
import { Modal } from "react-bootstrap";

interface ImageModalProps {
    image: {
        id: number;
        title: string;
        content: string;
        author: string;
        date: string;
        imagePath: string;
        likes: number;
        visibilityStatus: string;
    };

    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({image, onClose}) => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton={true}>
                <Modal.Title>{image.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={image.imagePath} className='img-fluid'/>
                <p>Author: {image.author}</p>
            </Modal.Body>
        </Modal>
    )
}

export default ImageModal;