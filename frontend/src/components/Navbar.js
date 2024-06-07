import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      // console.error(err);
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg w-100 ">
      <div className="container-fluid mx-3">
        <NavLink className="navbar-brand" to="/">
          <img src="/muLogoBrown.png" width="150em" alt="MU Logo" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-1">
              <NavLink className="nav-link" exact="true" to="/">
                Add Student
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink className="nav-link" to="/students" end>
                Student Details
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink className="nav-link" to="/courses/add">
                Add Course
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink className="nav-link" to="/courses" end>
                Course Details
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink className="nav-link" to="/users/add">
                Add User
              </NavLink>
            </li>
          </ul>
          {userInfo ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-1">
                <NavLink to="/users/profile" className="nav-link">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  {userInfo.name}
                </NavLink>
              </li>
              <NavLink className="btn ms-lg-4" to="#" onClick={logoutHandler}>
                Log Out
              </NavLink>
            </ul>
          ) : (
            <>
              {/* <Link className="nav-link" to="/login">
                  Sign In
                </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
