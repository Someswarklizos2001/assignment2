import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/modal.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { CircularProgress } from "./CircularProgress";

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

export const EntryCreateModal = ({ show, setShow, setBrokers }) => {
  const handleClose = () => setShow(false);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
  const [load, setLoad] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      setPreview(imageUrl);
    }
  };

//   const {
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

  const onSubmit = (data) => {
    if (file.length === 0) return toast.error("Please upload profile picture");
    setLoad(true);
    const formData = new FormData();

    formData.append("target_type", "broker");
    formData.append("method", "create");
    formData.append("target_id", "undefined");
    formData.append("underwriter_to_assign", "");
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("company_name", data.company_name);
    formData.append("phone_number", data.phone_number);
    formData.append("profile_pciture", file);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/create_or_edit_user`, formData, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        },
      })
      .then((res) => {
        setBrokers((prev) => [
          ...prev,
          {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
            company_name: data.company_name,
          },
        ]);
        toast.success(res.data.message);
        setPreview("");
        setFile("");
        // reset({
        //   first_name: "",
        //   last_name: "",
        //   email: "",
        //   password: "",
        //   company_name: "",
        //   phone_number: "",
        // });

        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#007bff" }}>Add New Broker</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form >
          <div>Profile Picture</div>

          <div className={styles.imageIconDiv}>
            <img
              src={preview === "" ? "../../profileImage.jpg" : preview}
              alt="Profile"
              className={styles.img}
              onClick={handleImageClick}
            />

            <p className={styles.profileIcon} onClick={handleImageClick}>
              <FaCamera />
            </p>
          </div>

          <Container>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Container>
         

          <Container style={{ marginTop: "5px" }}>
            <Form.Label>
              Email <span className={styles.red}>*</span>
            </Form.Label>
            {/* <Controller
              control={control}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="email"
                  placeholder="Enter email"
                  style={{ marginTop: "-5px" }}
                />
              )}
            /> */}
            <Form.Text className="text-danger">
              {/* {errors.email?.message} */}
            </Form.Text>
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
