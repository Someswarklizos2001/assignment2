import { useState } from "react";
import "./App.css";
import { DocumentTable } from "./components/DocumentTable";
import { NotificationTable } from "./components/NotificationTable";
import styles from "./styles/App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoMdAdd } from "react-icons/io";
import { EntryCreateModal } from "./components/EntryCreateModal";

function App() {
  const [document, setDocument] = useState([
    {
      name: "Privacy Policy",
      file_name: "NCT-SEG-SEG.csv",
      last_updated_on: "01/23/2024, 04:29:47 AM",
    },
    {
      name: "Privacy Policy",
      file_name: "NCT-SEG-SEG.csv",
      last_updated_on: "01/23/2024, 04:29:47 AM",
    },
  ]);

  const [notification, setNotification] = useState([
    {
      notification_type: "Payment Invoice",
      Email: "someswar@klizos.com",
    },
    {
      notification_type: "Payment Invoice",
      Email: "suphal@klizos.com",
    },
    {
      notification_type: "Payment Invoice",
      Email: "pankaj@klizos.com",
    },
    {
      notification_type: "Payment Invoice",
      Email: "danish@klizos.com",
    },
  ]);

  const [documentLoad, setDocumentLoad] = useState(false);
  const [notificationLoad, setNotificationLoad] = useState(false);
  const [show, setShow] = useState(false);

  const handleClickModal = () => {
    setShow(true);
  };
  return (
    <div className={styles.center}>
      <p className={styles.h1}>Settings</p>
      <DocumentTable
        document={document}
        load={documentLoad}
        setDocument={setDocument}
      />

      <div className={styles.buttonDiv}>
        <button className={styles.btn} onClick={handleClickModal}>
          <span>
            <IoMdAdd className={styles.icon} />
          </span>
          <span>Add New</span>
        </button>
      </div>
      <NotificationTable
        notification={notification}
        setNotification={setNotification}
        load={notificationLoad}
      />

      <EntryCreateModal
        show={show}
        setShow={setShow}
        notification={notification}
        setNotification={setNotification}
      />
    </div>
  );
}

export default App;
