import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditButton = ({ studentOrCourse, id }) => {
  return (
    <Link
      to={`/${(studentOrCourse += "s")}/edit/${id}`}
      className="btn btn-edit"
    >
      <FontAwesomeIcon icon={faPencil} />
    </Link>
  );
};

export default EditButton;
