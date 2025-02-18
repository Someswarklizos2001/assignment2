import { useEffect, useState } from "react";
import "./App.css";
import { DocumentTable } from "./components/DocumentTable";
import { NotificationTable } from "./components/NotificationTable";
import styles from "./styles/App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoMdAdd } from "react-icons/io";
import { EntryCreateModal } from "./components/EntryCreateModal";
import axios from "axios";
import toast from "react-hot-toast";

function App() {
 

  const [notification, setNotification] = useState();

  
  const [notificationLoad, setNotificationLoad] = useState(true);
  const [show, setShow] = useState(false);

  const handleClickModal = () => {
    setShow(true);
  };

 
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/private/auth/notification`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setNotification(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setNotificationLoad(false);
      });
  }, []);
  return (
    <div className={styles.center}>
      <p className={styles.h1}>Settings</p>
      <div className={styles.notficationParent}>
        <div className={styles.flex}>
          <h2>Document</h2>
        </div>
        <DocumentTable
        />
      </div>
      <div className={styles.notficationParent}>
        <div className={styles.flex}>
          <h2>Notification</h2>

          <div className={styles.buttonDiv}>
            <button className={styles.btn} onClick={handleClickModal}>
              <span>
                <IoMdAdd className={styles.icon} />
              </span>
              <span>Add New</span>
            </button>
          </div>
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
          setNotificationArray={setNotification}
        />
      </div>
    </div>
  );
}

export default App;
