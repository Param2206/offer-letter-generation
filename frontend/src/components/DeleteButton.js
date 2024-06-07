import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = ({ studentOrCourse, id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/${studentOrCourse + "s"}/delete/${id}`);
      onDelete(id);
      toast.success(
        `${
          studentOrCourse.charAt(0).toUpperCase() + studentOrCourse.slice(1)
        } deleted successfully`
      );
    } catch (error) {
      // console.error(`Error deleting ${studentOrCourse}:`, error);
      toast.error(`Error deleting ${studentOrCourse}`);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="border rounded p-4 bg-light-subtle shadow">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this {studentOrCourse}?</p>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn me-2" onClick={() => onClose()}>
                No
              </button>
              <button
                className="btn btn-delete"
                onClick={() => {
                  handleDelete();
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <button className="btn btn-delete" onClick={confirmDelete}>
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

export default DeleteButton;
