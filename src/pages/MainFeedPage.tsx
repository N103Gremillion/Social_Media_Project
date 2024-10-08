import React from "react";

const MainFeedPage : React.FC = () => {

  const mainDivStyle : React.CSSProperties = {
    backgroundColor: 'lightyellow',
    width: '100%',
    height: '100vh',
    padding: '20px',
    textAlign: 'center',
    // make the items in div vertially align
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    position: 'fixed',
    marginLeft: '5%',
    zIndex: '-1'
  };

  return (
    <div style={mainDivStyle}>
      <h1>
        Yo this is the page
      </h1>
    </div>
  );
}

export default MainFeedPage;