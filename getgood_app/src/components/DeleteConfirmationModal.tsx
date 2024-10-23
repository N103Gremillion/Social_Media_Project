import React from "react";
import { Button, Modal } from "react-bootstrap";
import './styles/deleteConfirmationModal.css'

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const DefaultConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  show,
  onHide,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DefaultConfirmationModal;
