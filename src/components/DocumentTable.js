import Table from "react-bootstrap/Table";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Modal, Button, ProgressBar, Nav, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../styles/Notification.module.css";
import { HiDownload, HiTrash, HiUpload } from "react-icons/hi";
import { CircularProgress } from "./CircularProgress";

export const DocumentTable = () => {
  const [showActionModal, setShowActionModal] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const inputRef = useRef(null);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [terms, setTerms] = useState([]);
  const [privacy, setPrivacy] = useState([]);

  const handleOpenActionModal = (doc) => {
    console.log(doc);
    setSelectedDoc(doc);
    setShowActionModal(true);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document/all`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const termsData = res.data.filter((item) => item.type === "TERMS");
        const privacyData = res.data.filter((item) => item.type === "PRIVACY");

        console.log(termsData, privacyData);
        setTerms(termsData);
        setPrivacy(privacyData);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {});
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document?documentType=${selectedDoc.type}&name=${selectedDoc.name}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );

      if (res) {
        toast.error("Document deleted successfully!");

        if (selectedDoc.type === "TERMS") {
          setTerms((prevTerms) =>
            prevTerms.map((doc) =>
              doc.type === "TERMS"
                ? { ...doc, name: "No file is uploaded", disabled: true }
                : doc
            )
          );

          setTerms({ type: "TERMS", name: undefined });
        } else if (selectedDoc.type === "PRIVACY") {
          setPrivacy((prevPrivacy) =>
            prevPrivacy.map((doc) =>
              doc.type === "PRIVACY"
                ? { ...doc, name: "No file is uploaded", disabled: true }
                : doc
            )
          );
          setPrivacy({ type: "PRIVACY", name: undefined });
        }

        setShowActionModal(false);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document!");
    }
  };

  const handleDownload = async () => {
    setDownloadLoader(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document?documentType=${selectedDoc.type}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );

      if (res.status === 200 && res.data.link) {
        const fileUrl = res.data.link;
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = fileUrl;
        a.download = "document.csv";
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          toast.success("Downloaded successfully!!");
          setShowActionModal(false);
        }, 1000);

        setDownloadLoader(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "File is removed";
      toast.error(errorMessage);
      setDownloadLoader(false);
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document?documentType=${selectedDoc.type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
          onUploadProgress: (progressEvent) => {
            const bar = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(bar);
          },
        }
      );

      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document/all`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          const termsData = res.data.filter((item) => item.type === "TERMS");
          const privacyData = res.data.filter(
            (item) => item.type === "PRIVACY"
          );

          console.log(termsData, privacyData);
          setTerms(termsData);
          setPrivacy(privacyData);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });

      toast.success("File uploaded successfully");
      setProgress(0);
      setSelectedFile(null);
      setShowActionModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Upload failed";
      toast.error(errorMessage);
    }
  };

  const handleByClick = async (data) => {
    setDownloadLoader(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/private/backoffice/file/upload/document?documentType=${data.type}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );

      if (res.status === 200 && res.data.link) {
        const fileUrl = res.data.link;
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = fileUrl;
        a.download = "document.csv";
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          toast.success("Downloaded successfully!!");
          setShowActionModal(false);
        }, 1000);

        setDownloadLoader(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "File is removed";
      toast.error(errorMessage);
      setDownloadLoader(false);
    }
  };

  return (
    <div className={styles.tableContainer}>
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
          <tr>
            <td>Terms & Conditions</td>
            <td
              style={{ color: "gray", cursor: "pointer" }}
              onClick={(e) =>
                !terms.disabled
                  ? handleByClick({ type: "TERMS", name: privacy?.[0]?.name })
                  : null
              }
            >
              {terms?.[0]?.name !== undefined
                ? terms?.[0]?.name
                : "No file is uploaded"}
            </td>
            <td>
              {terms?.[0]?.updatedAt
                ? dayjs(terms?.[0]?.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                : dayjs().format("YYYY-MM-DD HH:mm:ss")}
            </td>
            <td>
              <HiOutlineDotsVertical
                onClick={() =>
                  handleOpenActionModal({
                    type: terms?.[0]?.name !== null ? "TERMS" : null,
                    name: terms?.[0]?.name !== null ? terms?.[0]?.name : null,
                  })
                }
                style={{ color: "gray", cursor: "pointer" }}
              />
            </td>
          </tr>
          <tr>
            <td>Privacy Policy</td>
            <td
              style={{ color: "gray", cursor: "pointer" }}
              onClick={(e) =>
                !privacy.disabled
                  ? handleByClick({ type: "PRIVACY", name: privacy?.[0]?.name })
                  : null
              }
            >
              {privacy?.[0]?.name !== undefined
                ? privacy?.[0]?.name
                : "No file is uploaded"}
            </td>
            <td>
              {" "}
              {privacy?.[0]?.updatedAt
                ? dayjs(privacy?.[0]?.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                : dayjs().format("YYYY-MM-DD HH:mm:ss")}
            </td>
            <td>
              <HiOutlineDotsVertical
                onClick={() =>
                  handleOpenActionModal({
                    type: privacy?.[0]?.name !== null ? "PRIVACY" : null,
                    name:
                      privacy?.[0]?.name !== null ? privacy?.[0]?.name : null,
                  })
                }
                style={{ color: "gray", cursor: "pointer" }}
              />
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Action Modal */}
      <Modal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Actions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container defaultActiveKey="upload">
            <Nav variant="tabs" className="justify-content-center mb-3">
              {selectedDoc?.name !== undefined && (
                <Nav.Item>
                  <Nav.Link eventKey="download">Download</Nav.Link>
                </Nav.Item>
              )}

              <Nav.Item>
                <Nav.Link eventKey="upload">Upload</Nav.Link>
              </Nav.Item>

              {selectedDoc?.name !== undefined && (
                <Nav.Item>
                  <Nav.Link eventKey="delete">Delete</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <Tab.Content>
              {selectedDoc?.name !== undefined && (
                <Tab.Pane eventKey="delete">
                  <div className={styles.download}>
                    <HiTrash className={styles.downloadIcon} />
                    <p>Are you sure you want to delete this document?</p>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </Tab.Pane>
              )}
              {selectedDoc?.name !== undefined && (
                <Tab.Pane eventKey="download">
                  <div className={styles.download}>
                    <HiDownload className={styles.downloadIcon} />
                    <p>Are you sure you want to download this document?</p>
                    <Button
                      variant="warning"
                      disabled={downloadLoader}
                      onClick={handleDownload}
                    >
                      {downloadLoader ? <CircularProgress /> : "Download"}
                    </Button>
                  </div>
                </Tab.Pane>
              )}
              <Tab.Pane eventKey="upload">
                <div className={styles.download}>
                  <HiUpload className={styles.downloadIcon} />
                  {!selectedFile && <p>select a file</p>}
                  <input
                    type="file"
                    hidden
                    ref={inputRef}
                    onChange={handleFileChange}
                  />
                  {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                  <div className={styles.flex}>
                    <Button variant="primary" onClick={handleImageClick}>
                      Select File
                    </Button>
                    {selectedFile && (
                      <Button variant="success" onClick={handleUpload}>
                        Upload
                      </Button>
                    )}
                  </div>
                  {progress > 0 && (
                    <ProgressBar
                      now={progress}
                      label={`${progress}%`}
                      animated
                      style={{
                        height: "10px",
                        marginTop: "10px",
                        width: "250px",
                      }}
                    />
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </div>
  );
};
