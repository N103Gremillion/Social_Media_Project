import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import axios from 'axios';

interface EditPostModalProps {
    onClose: () => void;
    post: Post;
    deletePost: (post: Post) => void;
}

interface Post {
    id: number;
    goal_id: number;
    checkpoint_id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string;
    likes: number;
    visibilityStatus: string;
}

interface Goal {
    id: number;
    name: string;
}

interface Checkpoint {
    id: number;
    name: string;
    goalId: number;
}

const EditPostModal: React.FC<EditPostModalProps> = ({onClose, post, deletePost}) => {
    const [title, setTitle] = useState<string>(post.title);
    const [image, setImage] = useState<File | null>(null);
    const [author, setAuthor] = useState<string>(post.author);
    const [date, setDate] = useState<string>(post.date);
    const [content, setContent] = useState<string>(post.content);
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [goals, setGoals] = useState<Goal[]>([]); 
    const [selectedGoal, setSelectedGoal] = useState<number | null>(post.goal_id);
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(post.checkpoint_id);
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

    const handleDeletePost = () => {
        deletePost(post);
        onClose();
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
        formData.append('goal_id', `${selectedGoal}`);
        formData.append('checkpoint_id', `${selectedCheckpoint}`);
        formData.append('owner_id', (sessionStorage.getItem('userID') || "1"));
        formData.append('title', title);
        formData.append('author', author);
        formData.append('date', date);
        formData.append('content', content);
        formData.append('type', 'mainFeedPost');
        if (image) {
            formData.append('image', image);
            formData.append('imageName', image.name)
        }

        await axios.put(`${BASE_URL}api/posts/${post.id}`, formData)
        .then(res => console.log(res))
        .catch(err => console.log('Error submitting the post:', err))
        .finally(() => {
            setPostLoading(false);
            onClose();
        })

    }

    useEffect(() => {
        axios.get(`${BASE_URL}getUserGoals?userId=${sessionStorage.getItem("userID")}`)
            .then(response => setGoals(response.data))
            .catch(err => console.error(err));
        
    }, []);

    useEffect(() => {
        if (selectedGoal) {
            axios.get(`${BASE_URL}api/checkpoints?goalId=${selectedGoal}&userId=${sessionStorage.getItem("userID")}`)
                .then(response => setCheckpoints(response.data.checkpoints))
                .catch(err => console.error(err));
        }
    }, [selectedGoal]);

    return (
        <Modal show={true} onHide={onClose} >
            <Modal.Header closeButton={true}>
                Edit Post
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
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description"
                            value={content}
                            onChange={handleContentChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='selectGoal'>
                        <Form.Label>Goal</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedGoal || ''}
                            onChange={(e) => setSelectedGoal(Number(e.target.value))}
                            required
                        >
                            <option value="">Select a Goal</option>
                            {goals.map(goal => (
                                <option key={goal.id} value={goal.id}>{goal.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='selectCheckpoint'>
                        <Form.Label>Checkpoint</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedCheckpoint || ''}
                            onChange={(e) => setSelectedCheckpoint(Number(e.target.value))}
                            required
                        >
                            <option value="">Select a Checkpoint</option>
                            {selectedGoal && Array.isArray(checkpoints)  && checkpoints.map(checkpoint => (
                                <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='imageFile'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="image-File"
                            onChange={handleFileChange}
                            accept='image/*'
                            
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit'>
                        {postLoading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />) 
                            : ("Save Changes")
                        }
                    </Button>
                    <Form.Group controlId='submitButton'>
                        <Button variant="danger" onClick={handleDeletePost}>Delete</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );

}

export default EditPostModal;

