import Spinner from 'react-bootstrap/Spinner';

const Loader = () => (
  <>
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" variant="primary" role="status" style={{ width: '2rem', height: '2rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  </>
);

export default Loader;
