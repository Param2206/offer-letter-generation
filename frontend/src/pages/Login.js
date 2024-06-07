import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data.message || err.error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div
            className="card login-card mx-auto"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body">
              <h2 className="text-center h3">Log in to your account</h2>
              <p className="text-center mb-4">
                Use your email and password to log in
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* <label htmlFor="email" className="form-label">
                    Email
                  </label> */}
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                    required
                  />
                </div>
                <div className="mb-3">
                  {/* <label htmlFor="password" className="form-label">
                    Password
                  </label> */}
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                    required
                  />
                </div>
                <button type="submit" className="btn w-100">
                  Log In
                </button>
                {isLoading && <Loader />}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
