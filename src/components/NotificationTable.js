import Table from "react-bootstrap/Table";
import { CircularProgress } from "./CircularProgress";
import styles from "../styles/Notification.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

export const NotificationTable = ({ load, notification, setNotification }) => {
  const [show, setShow] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [deleteLoad, setDeleteLoad] = useState(false);

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

  const getNotificationLabel = (value) => {
    const match = notificationOptions.find((option) => option.value === value);
    return match ? match.label : "Unknown Notification";
  };

  const handleOpen = (notification) => {
    setSelectedNotification(notification);
    console.log(notification);
    setShow(true);
  };

  const handleDelete = () => {
    if (!selectedNotification) return;

    setDeleteLoad(true);

    const notificationType = Object.keys(selectedNotification)[0];
    const notificationData = selectedNotification[notificationType];

    if (!notificationData || !notificationData.id) {
      toast.error("Invalid notification data!");
      setDeleteLoad(false);
      return;
    }

    const notificationId = notificationData.id;

    console.log("Deleting Notification Type:", notificationType);
    console.log("Notification ID:", notificationId);

    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/private/auth/notification/${notificationId}/${notificationType}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      )
      .then((res) => {
        setNotification((prev) =>
          prev.filter((doc) => Object.keys(doc)[0] !== notificationType)
        );
        setShow(false);
        toast.success("Notification deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err?.response?.data?.message || "Failed to delete notification"
        );
      })
      .finally(() => {
        setDeleteLoad(false);
      });
  };

  return (
    <div className={styles.tableContainer}>
      {load ? (
        <div className={styles.center}>
          <CircularProgress />
        </div>
      ) : (
        <Table striped bordered hover className={styles.mainTable}>
          <thead>
            <tr>
              <th>Notification Type</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {notification?.length > 0 ? (
              notification.map((data, index) => {
                const notificationType = Object.keys(data)[0];
                const notificationLabel =
                  getNotificationLabel(notificationType);

                return (
                  <tr key={index}>
                    <td>{notificationLabel}</td>
                    <td>{data[notificationType]?.email || "N/A"}</td>
                    <td>
                      <HiOutlineDotsVertical
                        className={styles.dotsIcon}
                        onClick={() => handleOpen(data)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Data Available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>
          Are you sure you want to delete this notification?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            {deleteLoad ? <CircularProgress /> : "Delete"}
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
