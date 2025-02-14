import Table from "react-bootstrap/Table";
import { useState } from "react";
import styles from "../styles/Notification.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Modal, Button } from "react-bootstrap";
import { CircularProgress } from "./CircularProgress";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";

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

  const handleDownload = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document?documentType=${selectedDoc.type}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200 && res.data.link) {
          const fileUrl = res.data.link;
  
          // Open in a new tab (test if this works)
          window.open(fileUrl, "_blank");
  
          // If opening works, then try force-downloading
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.href = fileUrl;
          a.download = "document.csv"; // <-- Set filename
          a.click();
          document.body.removeChild(a);
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((err) => {
        console.error("Download Error:", err);
  
        let errorMessage = "Download failed";
        if (err.response) {
          errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
        } else if (err.message) {
          errorMessage = err.message;
        }
  
        toast.error(errorMessage);
      });
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
        <Modal.Body>Actions</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="warning" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
