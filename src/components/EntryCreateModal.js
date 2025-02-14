import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/modal.module.css";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { CircularProgress } from "./CircularProgress";
import { Dropdown } from "react-bootstrap";

// const schema = yup.object().shape({
//   first_name: yup.string().required("First name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Minimum 8 characters are required")
//     .max(15, "Maximum 15 characters are required")
//     .matches(/[a-z]/, "password should contain atleast one lowercase")
//     .matches(/[A-Z]/, "password should contain atleast one uppercase")
//     .matches(/[1-9]/, "password should contain atleast one number")
//     .matches(
//       /[!@#$%^&*()_+|/?,./]/,
//       "password should contain atleast one special characters"
//     )
//     .required("Password is required"),
//   phone_number: yup
//     .string()
//     .matches(/^\d{10}$/, "Phone number must be 10 digits"),
// });

export const EntryCreateModal = ({ show, setShow, setNotificationArray }) => {
  const handleClose = () => setShow(false);
  const [load, setLoad] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationLabel, setNotificationLabel] = useState(
    "Select a notification"
  );
  const [email, setEmail] = useState("");

  console.log(notification);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    // Validate notification selection
    if (!notification || notificationLabel === "Select a notification") {
      toast.error("Please select a notification from dropdown");
      setLoad(false);
      return;
    }

    // Validate email
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email");
      setLoad(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/private/auth/notification`,
        {
          email: email,
          type: notification,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );

      const newNotification = {
        [notification]: {
          email: email,
        },
      };

      // Update the state
      setNotificationArray((prev) => [...prev, newNotification]);

      toast.success(response.data.message || "Notification added successfully");
    } catch (err) {
      console.error("API Error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoad(false);
      setEmail("");
      setNotification("");
      setNotificationLabel("Select a notification");
      handleClose();
    }
  };

  const notificationOptions = [
    { value: "OPEN", label: "Order open alert" },
    { value: "ON_HOLD", label: "Low funds order" },
    { value: "NON_API", label: "Manual fulfillment" },
    { value: "FUND_INVOICE", label: "Payment invoice" },
    { value: "QUICK_BOOK", label: "Order report" },
    { value: "INVENTORY_REPORT", label: "Inventory report" },
    { value: "LOW_FUND_ALERT", label: "Low fund alert" },
    { value: "OUT_OF_STOCK", label: "Out Of Stock" },
  ];

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#007bff" }}>Add Notification</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Form.Label>
              Notification <span className={styles.red}>*</span>
            </Form.Label>

            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                style={{ width: "440px" }}
              >
                {notificationLabel}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ width: "440px" }}>
                {notificationOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    onClick={() => {
                      setNotificationLabel(option.label);
                      setNotification(option.value);
                    }}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Container>

          <Container style={{ marginTop: "5px" }}>
            <Form.Label>
              Email <span className={styles.red}>*</span>
            </Form.Label>

            <Form.Control
              type="email"
              placeholder="Enter email"
              style={{ marginTop: "-5px" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Container>

          <div className={styles.ButtonDiv}>
            <Button
              disabled={load}
              variant="primary"
              type="submit"
              className={styles.submitBtn}
            >
              {load ? <CircularProgress /> : "Add"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
