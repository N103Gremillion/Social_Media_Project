import { useState, useEffect } from "react";
import axios from "axios";
import '../components/styles/explore.css';
import ImageModal from '../components/ImageModal.tsx';
import Loader from "../components/Loader.tsx";
import InfiniteScroll from 'react-infinite-scroll-component';

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
    const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
    const [postIndex, setPostIndex] = useState(0);  
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const BASE_URL: string = 'http://localhost:4000/';

    const fetchPosts = async () => { 
        // fetches the inital 1st 10 posts
        await axios.get(`${BASE_URL}api/posts?offset=0&limit12`)
        .then( response => {
          setPosts(response.data);
        })
        .catch(error => console.error('error fetching posts: ', error))
    }
    
    useEffect( () => { 
        fetchPosts();
    }, []);
    
    const fetchMorePosts = async () => {
    
        console.log("trying to get more posts");

        if (!hasMorePosts || postsLoading) return;

        await axios.get(`${BASE_URL}api/posts?offset=${postIndex * 12}&limit12`)
        .then( response => {
            setPosts(posts => [...posts, ...response.data]);

            response.data.length > 0 ? setHasMorePosts(true) : setHasMorePosts(false);
        })
        .catch(error => console.error('error fetching posts: ', error))
        setPostIndex((postIndex) => postIndex + 1)
    }

    const openModal = (image: ImageData) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="explore-page" id="explore-page">
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMorePosts}
                loader={<Loader/>}
                endMessage={
                    <p style={{textAlign: "center"}}>
                        <b> That is all!! </b>
                    </p>
                } 
                className={"images-display"}
                scrollableTarget="explore-page"
            >
                {posts.map((post) => (
                    <div className="post-image" >
                        <img
                        key={post.id}
                        src={post.imagePath}
                        onClick={() => openModal(post)}
                        className="image"
                        />
                    </div>
                    
                ))}

            </InfiniteScroll>
            {selectedImage && (
                <div className="image-modal">
                    <ImageModal image={selectedImage} onClose={closeModal} />
                </div>
            )}
        </div>
    );
};

export default Explore;
