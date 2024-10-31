import React, { useState } from 'react';
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import axios from 'axios';

interface CreatePostModalProps {
    onClose: () => void;
}
const CreatePostModal: React.FC<CreatePostModalProps> = ({onClose}) => {
    const [title, setTitle] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [author, setAuthor] = useState<string>('author');
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
    const [content, setContent] = useState<string>('');
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const BASE_URL : string = 'http://localhost:4000/';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxFileSize = 10 * 1024 * 1024;

        if  (e.target.files) {
            const file = e.target.files[0];
            if (file.size > maxFileSize) {
                alert("File size excedes 5MB please choose a different file.");
                e.target.value = "";
            }
            else {
                setImage(e.target.files[0]);
            }
        } 
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPostLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('date', date);
        formData.append('content', content);
        formData.append('type', 'mainFeedPost');
        if (image) {
            formData.append('image', image);
            formData.append('imageName', image.name)
        }

        await axios.post(`${BASE_URL}api/posts`, formData)
        .then(res => console.log(res))
        .catch(err => console.log('Error submitting the post:', err))
        .finally(() => {
            setPostLoading(false);
            onClose();
        })

    }

    return (
        <Modal show={true} onHide={onClose} >
            <Modal.Header closeButton={true}>
                Create Post
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='description'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description"
                            value={content}
                            onChange={handleContentChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='imageFile'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="image-File"
                            onChange={handleFileChange}
                            accept='image/*'
                            required
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit'>
                        {postLoading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />) 
                            : ("Submit")
                        }
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );

}

export default CreatePostModal;

