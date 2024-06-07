import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CourseDetails from "./pages/CourseDetails";
import AddStudent from "./pages/AddStudent";
import AddCourse from "./pages/AddCourse";
import StudentDetails from "./pages/StudentDetails";
import EditStudent from "./pages/EditStudent";
import EditCourse from "./pages/EditCourse";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AddUser from "./pages/AddUser";
import UpdateProfile from "./pages/UpdateProfile";
import Private from "./components/Private";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const location = useLocation();
  const hideNavbarPaths = ["/login"];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="" element={<Private />}>
          <Route exact="true" path="/" element={<AddStudent />} />
          <Route exact="true" path="/students" element={<StudentDetails />} />
          <Route exact="true" path="/courses" element={<CourseDetails />} />
          <Route path="/courses/add" element={<AddCourse />} />
          <Route
            path="/students/edit/:studentId"
            element={<EditStudent studentId={""} />}
          />
          <Route
            path="/courses/edit/:courseId"
            element={<EditCourse courseId={""} />}
          />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/profile" element={<UpdateProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
