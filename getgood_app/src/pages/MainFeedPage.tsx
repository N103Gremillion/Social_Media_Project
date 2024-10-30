import React, { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import FormData from 'form-data';
import InfiniteScroll from 'react-infinite-scroll-component';

const MainFeedPage : React.FC = () => {

  type PostType = {
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string;
    likes: number
  }

  const [isPostPromptOpen, setIsPostPromptOpen] = useState(false);
  const [isReqestInProgress, setIsReqestInProgress] = useState(false);
  const [author, setAuthor] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>('');
  const [likes] = useState<number>(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [postIndex, setPostIndex] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const BASE_URL : string = 'http://localhost:4000/';

  const fetchPosts = async () => { 
    // fetches the inital 1st 10 posts
    await axios.get(`${BASE_URL}api/posts?offset=0&limit=10`)
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

    if (!hasMorePosts) return;

    await axios.get(`${BASE_URL}api/posts?offset=${postIndex * 10}&limit=10`)
    .then( response => {
      setPosts(posts => [...posts, ...response.data]);

      response.data.length > 0 ? setHasMorePosts(true) : setHasMorePosts(false);
    })
    .catch(error => console.error('error fetching posts: ', error))
    setPostIndex((postIndex) => postIndex + 1)
  }

  const openPromptForPost = () => {
    setIsPostPromptOpen(true);
  };

  const closePromptForPost = () => {

    setAuthor('');
    setDate('');
    setTitle('');
    setContent('');
    setImagePath('');
    setIsPostPromptOpen(false);
    
  };

  const handlePostNameChange = (event : ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const handlePostDateChange = (event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    let inputValue = (event as ChangeEvent<HTMLInputElement>).target.value;
    setDate(inputValue);
};

  const handlePostTitleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handlePostMainTextChange = (event : ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    const lineCount = newValue.split('\n').length;

    if (lineCount <= 50) {
      setContent(newValue);
    } 
    else {
      console.log("Maximum line limit reached!");
    }
  }

  const handleImageChange = (event : ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSize = 5 * 1024 * 1024;
    if (file) {
      if (file.size > maxSize) {
        setImageError('Image is above limit of 5 MB');
      }
      else {
        setImageError('');
        const imageUrl = URL.createObjectURL(file); 
        setImagePath(imageUrl); 
        setImageFile(file);
      }
    }
  }

  const submitPost = async () => {

    if (title === '' || author === '' || date === '' || content === '' || isReqestInProgress === true) {
      return;
    }
    
    const [year, month, day] = date.split('-');
    // Reformat the date to "month-day-year"
    const formattedDate = `${month}-${day}-${year}`;

    const newPost: PostType = {title, content, author, date: formattedDate, imagePath, likes};
    
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('date', date); 
    formData.append('type', 'mainFeedPost');

    if (imageFile) {
      formData.append('image', imageFile);
      formData.append('imageName', imageFile.name) 
    }

    else {
      console.log("No image file");
    }

    setIsReqestInProgress(true);
    await axios.post(`${BASE_URL}api/posts`, formData)
    .then(res => console.log(res))
    .catch(err => console.log('Error submitting the post:', err))
    .finally(() => {
      setPosts([...posts, newPost]);
      setIsReqestInProgress(false);
      closePromptForPost();
    })
    
  }

  const mainDivStyle : React.CSSProperties = {
    backgroundColor: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: '0',
    height: '100vw'
  };

  const scrollerStyling : React.CSSProperties = {
    width: '80%',
    marginRight: '20%',
    paddingRight: '3%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    textAlign: 'center',
    padding: 8
  }

  const addPostButtonStyle : React.CSSProperties = {
    backgroundColor: 'orange',
    borderRadius: '25%',
    width: '10%',
    height: '10%',
    position: 'fixed',
    left: '83%',
    bottom: '5%'
  }

  const postPromptOverlayStyle : React.CSSProperties = {
    // align elements in div vertically with even spacing
    backgroundColor: 'lightblue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space',
    height: '80vh',
    width: '88vw',
    margin: '3%',
    padding: '3%',
    border: '2px solid blue' 
  }

  const titleInputStyle : React.CSSProperties = {
    width: '20vw'
  }

  const nameInputStyle : React.CSSProperties = {
    width: '20vw',
  }

  const dateInputStyle : React.CSSProperties = {
    width: '20vw'
  }

  const submitPostButtonStyle : React.CSSProperties ={
    width: '20vw'
  }// Aligns elements vertically

  const closePostButtonStyle : React.CSSProperties = {
    width: '20vw'
  }

  if (isPostPromptOpen) {
    return (
      <div className="postPromptOverlay" style={postPromptOverlayStyle}>

        <h2 style={{textAlign: 'center'}}> Add your post! </h2>

        <p> What is the title? </p>
        <input
        style={titleInputStyle}
        placeholder="Title"
        maxLength={20}
        type="text"
        value={title}
        onChange={handlePostTitleChange}
        ></input>

        <p> What is your name? </p>
        <input
        style={nameInputStyle}
        placeholder="Name"
        maxLength={30}
        type="text"
        value={author}
        onChange={handlePostNameChange}
        ></input>

        <p> What is the date? (mm/dd/yyyy) </p>
        <input
        style={dateInputStyle}
        type="date"
        placeholder="MM/DD/YYYY"
        maxLength={10}
        value={date}
        onChange={handlePostDateChange}
        ></input>

        <p> Add you contents here. </p>
        <textarea  
          style={{
            width: '80vw',
            height: '10vw',
            outline: 'none',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
          placeholder="Enter your content here."
          value={content}
          onChange={handlePostMainTextChange}
        />

        <input
          type="file"
          placeholder="image-File"
          accept="image/*"
          onChange={handleImageChange}
        />

        <p style={{color:'red'}}>{imageError}</p>

        <div className="postPromptButtonContainer" style={{
          display: "flex",
          flexDirection: "row", 
          justifyContent: "space-between",
          width: "50%",
          marginTop: "2%"
        }}>
          <button 
            style={submitPostButtonStyle}
            onClick={submitPost} 
            className="submitPostButton">
            Submit Post
          </button>
          <button 
            style={closePostButtonStyle}
            onClick={closePromptForPost} 
            className="closePostButton">
            Close
          </button>
        </div>

      </div>
    );
  }

  return (
    <div>

      <div className="fixedHeader">
        <h2> </h2>
      </div>

      <InfiniteScroll 
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMorePosts}
          loader={<h4>Loading...</h4>}
          style={scrollerStyling}
          scrollableTarget="scrollableDiv"
          height={'100vw'}
        >
        <div className="mainFeedContainer" id="scrollableDiv" style={mainDivStyle}>
            {/* display all posts in the post array */}
            {posts.map((post, index) => (
              <Post
                key={index}
                title={post.title}
                content={post.content}
                author={post.author}
                date={post.date}
                imagePath={post.imagePath}
                likes={post.likes}
              />
            ))}
            {!hasMorePosts && <h4>There are not more Posts.</h4>}
          <button 
            style={addPostButtonStyle} 
            className="addPostButton"
            onClick={openPromptForPost}
          >
            + Post
          </button>
        </div>

      </InfiniteScroll>

    </div>
  );  
}

export default MainFeedPage;