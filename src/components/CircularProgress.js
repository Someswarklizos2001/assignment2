import Spinner from "react-bootstrap/Spinner";

export const CircularProgress = () => {
  return (
    <Spinner animation="border" role="status" style={{width:"20px",height:"20px"}}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};
