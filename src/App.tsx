import React, { useState } from 'react';
import Post from './pages/Post';
import MainFeedPage from './pages/MainFeedPage';

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
      
      {/* <Post
        title={examplePost.title}
        content={examplePost.content}
        author={examplePost.author}
        date={examplePost.date}
      /> */}
    </div>
  );
};



export default App;
