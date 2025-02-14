import Table from "react-bootstrap/Table";
import { CircularProgress } from "./CircularProgress";
import styles from "../styles/DocumentTable.module.css";


export const NotificationTable = ({ load, notification, setNotification }) => {
  return (
    <div className={styles.tableContainer}>
      {false ? (
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
            {notification.length > 0 ? (
              notification.map((data, index) => (
                <tr key={index}>
                  <td>{data.notification_type}</td>
                  <td>{data.Email}</td>
                  <td>:</td>
                </tr>
              ))
            ) : (
              <p>No Data Available.</p>
            )}
          </tbody>
        </Table>
      )}


    </div>
  );
};
