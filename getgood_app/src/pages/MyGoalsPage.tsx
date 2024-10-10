import Goal from "../components/Goal";




function MyGoalsPage() {
  return (
    <div
    style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'lightblue', 
      display: 'flex', 
      alignItems: 'center', 
      marginLeft: '5%',
      marginRight: '5%',
      justifyContent: 'space-evenly'
    }}>
      <Goal />
      <Goal />
      <Goal />
    </div>
  );
}

export default MyGoalsPage;
