import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import Post from "./Post";

const MainFeedPage : React.FC = () => {


  type PostType = {
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string
  }

  const [isPostPromptOpen, setIsPostPromptOpen] = useState(false);
  const [author, setAuthor] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  // list of current posts
  const [posts, setPosts] = useState<PostType[]>([]);

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
    }
  }

  const submitPost = () => {
    if (title === '' || author === '' || date === '' || content === '') {
      return;
    }
    
    const [year, month, day] = date.split('-');
    // Reformat the date to "day-month-year"
    const formattedDate = `${day}-${month}-${year}`;

    const newPost: PostType = {title, content, author, date: formattedDate, imagePath};
    setPosts([...posts, newPost]);
    closePromptForPost();
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
            resize: 'none' // Optional: Prevent resizing if you want a fixed size
          }}
          placeholder="Enter your content here."
          value={content}
          onChange={handlePostMainTextChange}
        />

        <input
          type="file"
          placeholder="image-File"
          accept="image/png, image/jpeg"
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
      <div className="postContainer" id="diplayContainer"
      style={{
        width: '80%',
        marginRight: '20%',
        overflowY: 'auto',
        paddingRight: '3%',
        boxSizing: 'border-box'
      }}>
        {/* display all post in the post array */}
        {posts.map((post, index) => (
          <Post
            key={index}
            title={post.title}
            content={post.content}
            author={post.author}
            date={post.date}
            imagePath={post.imagePath}
          />
        ))}
      </div>
      <button 
      style={addPostButtonStyle} 
      className="addPostButton"
      onClick={openPromptForPost}>
        + Post
      </button>

    </div>
  );
}

export default MainFeedPage;