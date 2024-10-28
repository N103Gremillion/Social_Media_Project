import React, { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import FormData from 'form-data';

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
  const [likes] = useState<number>(0);
  // list of current posts
  const [posts, setPosts] = useState<PostType[]>([]);
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
    if (file) {
      const imageUrl = URL.createObjectURL(file); 
      setImagePath(imageUrl); 
      setImageFile(file);
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
    backgroundColor: 'lightyellow',
    width: '100%',
    height: '100vh',
    textAlign: 'center',
    // make the items in div vertially align
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    position: 'fixed',
    marginLeft: '5vw',
    zIndex: '0'
  };

  const addPostButtonStyle : React.CSSProperties = {
    backgroundColor: 'orange',
    borderRadius: '25%',
    width: '5%',
    height: '5%',
    position: 'absolute',
    left: '85%',
    bottom: '5%'
  }

  const postPromptOverlayStyle : React.CSSProperties = {
    // align elements in div vertically with even spacing
    backgroundColor: 'lightblue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space',
    height: '100vh',
    width: '98vw',
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

  const paragraphInputStyle : React.CSSProperties = {
    width: '80vw',
    height: '40%'
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
        maxLength={50}
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
            height: '40%',
            resize: 'none' 
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
    <div style={mainDivStyle}>
      <div 
        className="postContainer" 
        id="displayContainer"
        style={{
          width: '80%',
          marginRight: '20%',
          overflowY: 'auto',
          paddingRight: '3%',
          boxSizing: 'border-box'
        }}
      >
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
      </div>
      <button 
        style={addPostButtonStyle} 
        className="addPostButton"
        onClick={openPromptForPost}
      >
        + Post
      </button>
    </div>
  );  
}

export default MainFeedPage;