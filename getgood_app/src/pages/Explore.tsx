import { useState, useEffect } from "react";
import axios from "axios";
import '../components/styles/explore.css';
import ImageModal from '../components/ImageModal.tsx';

const Explore = () => {
    interface ImageData {
        id: number;
        title: string;
        content: string;
        author: string;
        date: string;
        imagePath: string;
        likes: number;
        visibilityStatus: string;
      }

    const [posts, setPosts] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const BASE_URL : string = 'http://localhost:4000/';
  
    const fetchPosts = async () => {
      await axios.get(`${BASE_URL}api/posts`)
      .then( response => {
        setPosts(response.data);
      })
      .catch(error => console.error('error fetching posts: ', error))
    }

    useEffect( () => {
        fetchPosts();
    }, []);

    const openModal = (image: ImageData) => {
        setSelectedImage(image);
    }

    const closeModal = () => {
        setSelectedImage(null);
    }

    return (
        <div className="explore-page">
            <div className="images-display" >
                {posts.map((post) => (
                    <img
                        key={post.id}
                        src={post.imagePath}
                        onClick={() => openModal(post)}
                        className="image"
                    />
                ))}
            </div>
            <div className="image-modal">
                {selectedImage && (<ImageModal image={selectedImage} onClose={closeModal}/>)}
            </div>

        </div>
    );
}

export default Explore;