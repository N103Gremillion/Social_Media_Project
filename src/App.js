import React, { useState } from 'react';
import MainFeedPage from './pages/MainFeedPage';
import Post from './pages/Post';

const App = () => {

  const examplePost = {
    title: "Hello World",
    content: "this is the first of my posts asdlkfjasdklfjasdl;kfjsd;lfsdkfjasdklfjasdfkljasdfkl;asdjfl;kasdf",
    author: "Nathan Gremillion",
    date: "October 6th 2024"
  };

  return (
    <div>
      {/* <MainFeedPage/> */}
      <MainFeedPage/>
      <Post
        title={examplePost.title}
        content={examplePost.content}
        author={examplePost.author}
        date={examplePost.date}
      />
      {/* button to update the post */}
      {/* <button onClick={updatePost}>Update Post</button> */}
    </div>
  );
};



export default App;

