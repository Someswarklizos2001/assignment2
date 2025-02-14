import Table from "react-bootstrap/Table";
import { useState } from "react";
import styles from "../styles/Notification.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Modal, Button } from "react-bootstrap";
import { CircularProgress } from "./CircularProgress";
import dayjs from "dayjs";

export const DocumentTable = ({ load, document, setDocument }) => {
  const [show, setShow] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleOpen = (doc) => {
    setSelectedDoc(doc);
    setShow(true);
  };

  const handleDelete = () => {
    setDocument(document.filter((doc) => doc !== selectedDoc));
    setShow(false);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 style={{ marginLeft: "25px" }}>Document</h2>
      {load ? (
        <div className={styles.center}>
          <CircularProgress />
        </div>
      ) : (
        <Table striped bordered hover className={styles.mainTable}>
          <thead>
            <tr>
              <th>Document</th>
              <th>File Name</th>
              <th>Last Updated On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {document.length > 0 ? (
              document.map((data, index) => (
                <tr key={index}>
                  <td>{data.type}</td>
                  <td>{data.name}</td>
                  <td>{dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>
                    <HiOutlineDotsVertical
                      className={styles.dotsIcon}
                      onClick={() => handleOpen(data)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Data Available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>Are you sure you want to delete this document?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
