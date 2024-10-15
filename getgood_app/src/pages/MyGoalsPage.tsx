import Goal from "../components/Goal";

const pageContentStyle: React.CSSProperties = {
  backgroundColor: 'lightyellow',
  width: '95%',
  height: '100vh',
  // padding: '20px',
  textAlign: 'center',
  // make the items in div vertially align
  display: 'flex',
  alignItems:'center',
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  position: 'fixed',
  marginLeft: '5vw',
  zIndex: '0',    
};



function MyGoalsPage() {
  return (
    <div style={pageContentStyle}>
      <Goal />
      <Goal />
      <Goal />
    </div>
  );
}

export default MyGoalsPage;
