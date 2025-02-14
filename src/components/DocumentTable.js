import Table from "react-bootstrap/Table";
import { CircularProgress } from "./CircularProgress";
import styles from "../styles/DocumentTable.module.css";

export const DocumentTable = ({ load, document, setDocument }) => {
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
                  <td>{data.name}</td>
                  <td>{data.file_name}</td>
                  <td>{data.last_updated_on}</td>
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
