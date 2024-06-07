import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import OfferLetterButton from "../components/OfferLetterButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const StudentDetails = () => {
  const [filters, setFilters] = useState({
    countryName: [],
    qualification: [],
    courseOfStudy: [],
    duration: [],
    academicYear: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showQualificationCollapse, setShowQualificationCollapse] =
    useState(false);
  const [showDurationCollapse, setShowDurationCollapse] = useState(false);
  const [showCountryCollapse, setShowCountryCollapse] = useState(false);
  const [showCourseCollapse, setShowCourseCollapse] = useState(false);
  const [showAcademicYearCollapse, setShowAcademicYearCollapse] =
    useState(false);
  const [sortCriteria, setSortCriteria] = useState("");

  const initialFetchRef = useRef(true);

  useEffect(() => {
    if (initialFetchRef.current) {
      initialFetchRef.current = false;
      async function fetchData() {
        try {
          const response = await axios.get("/api/students/get-all");
          setStudentData(response.data);
        } catch (error) {
          toast.error("Error fetching students");
        }
      }

      fetchData();
    }
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (deletedStudentId) => {
    setStudentData((prev) =>
      prev.filter((studentData) => studentData._id !== deletedStudentId)
    );
  };

  const handleClearFilters = () => {
    setFilters({
      countryName: [],
      qualification: [],
      courseOfStudy: [],
      duration: [],
      academicYear: [],
    });
  };

  const getAcademicYear = (studentId) => {
    const match = studentId.match(/\/(\d{4}-\d{2})\//);
    return match ? match[1] : "";
  };

  const filteredStudents = studentData.filter((student) => {
    const academicYear = getAcademicYear(student.studentId);
    return (
      (filters.countryName.length === 0 ||
        filters.countryName.includes(student.countryName)) &&
      (filters.qualification.length === 0 ||
        filters.qualification.includes(student.qualification)) &&
      (filters.courseOfStudy.length === 0 ||
        filters.courseOfStudy.includes(student.courseOfStudy)) &&
      (filters.duration.length === 0 ||
        filters.duration.includes(student.duration.toString())) &&
      (filters.academicYear.length === 0 ||
        filters.academicYear.includes(academicYear)) &&
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (sortCriteria === "name") {
      return a.studentName.localeCompare(b.studentName);
    } else if (sortCriteria === "studentId") {
      return a.studentId.localeCompare(b.studentId);
    }
    return 0;
  });

  const studentsCount = sortedStudents.length;

  return (
    <>
      <ToastContainer />
      <div className="container-fluid mt-4">
        <h1 className="h2 mb-4">Student Details</h1>
        <button
          className="btn mb-4"
          type="button"
          onClick={() => setShowOffcanvas(!showOffcanvas)}
        >
          Show Filters
        </button>
        <div
          className={`offcanvas offcanvas-start${showOffcanvas ? " show" : ""}`}
          tabIndex="-1"
          id="offcanvasFilters"
          aria-labelledby="offcanvasFiltersLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title h4" id="offcanvasFiltersLabel">
              Filters
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={() => setShowOffcanvas(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="input-group mb-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search by Student Name"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="btn" type="button">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="mb-3">
              <button
                className="btn btn-link text-decoration-none"
                type="button"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
            <div className="mb-3">
              <label className="form-label">Sort By:</label>
              <select
                className="form-select"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="studentId">Student ID</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowCountryCollapse(!showCountryCollapse)}
              >
                Country
                <FontAwesomeIcon
                  icon={showCountryCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${showCountryCollapse ? " show" : ""} mb-3`}
                id="countryCollapse"
              >
                {Array.from(
                  new Set(studentData.map((student) => student.countryName))
                ).map((countryName, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={countryName}
                      value={countryName}
                      checked={filters.countryName.includes(countryName)}
                      onChange={() =>
                        handleFilterChange("countryName", countryName)
                      }
                    />
                    <label htmlFor={countryName}>{countryName}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() =>
                  setShowQualificationCollapse(!showQualificationCollapse)
                }
              >
                Qualification
                <FontAwesomeIcon
                  icon={
                    showQualificationCollapse ? faChevronRight : faChevronDown
                  }
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${
                  showQualificationCollapse ? " show" : ""
                } mb-3`}
                id="qualificationCollapse"
              >
                {Array.from(
                  new Set(studentData.map((student) => student.qualification))
                ).map((qualification, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={qualification}
                      value={qualification}
                      checked={filters.qualification.includes(qualification)}
                      onChange={() =>
                        handleFilterChange("qualification", qualification)
                      }
                    />
                    <label htmlFor={qualification}>{qualification}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowCourseCollapse(!showCourseCollapse)}
              >
                Course of Study
                <FontAwesomeIcon
                  icon={showCourseCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${showCourseCollapse ? " show" : ""} mb-3`}
                id="courseCollapse"
              >
                {Array.from(
                  new Set(studentData.map((student) => student.courseOfStudy))
                ).map((courseOfStudy, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={courseOfStudy}
                      value={courseOfStudy}
                      checked={filters.courseOfStudy.includes(courseOfStudy)}
                      onChange={() =>
                        handleFilterChange("courseOfStudy", courseOfStudy)
                      }
                    />
                    <label htmlFor={courseOfStudy}>{courseOfStudy}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowDurationCollapse(!showDurationCollapse)}
              >
                Duration (in Years)
                <FontAwesomeIcon
                  icon={showDurationCollapse ? faChevronRight : faChevronDown}
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${
                  showDurationCollapse ? " show" : ""
                } mb-3`}
                id="durationCollapse"
              >
                {Array.from(
                  new Set(studentData.map((student) => student.duration))
                ).map((duration, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={duration}
                      value={duration}
                      checked={filters.duration.includes(duration.toString())}
                      onChange={() =>
                        handleFilterChange("duration", duration.toString())
                      }
                    />
                    <label htmlFor={duration}>{duration}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                className="btn-filter-category text-decoration-none d-flex justify-content-between align-items-center"
                type="button"
                onClick={() =>
                  setShowAcademicYearCollapse(!showAcademicYearCollapse)
                }
              >
                Academic Year
                <FontAwesomeIcon
                  icon={
                    showAcademicYearCollapse ? faChevronRight : faChevronDown
                  }
                  className="ms-1 small"
                />
              </button>
              <div
                className={`collapse${
                  showAcademicYearCollapse ? " show" : ""
                } mb-3`}
                id="academicYearCollapse"
              >
                {Array.from(
                  new Set(
                    studentData.map((student) =>
                      getAcademicYear(student.studentId)
                    )
                  )
                ).map((academicYear, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={academicYear}
                      value={academicYear}
                      checked={filters.academicYear.includes(academicYear)}
                      onChange={() =>
                        handleFilterChange("academicYear", academicYear)
                      }
                    />
                    <label htmlFor={academicYear}>{academicYear}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p>
              <b>Count:</b> {studentsCount}
            </p>
            <div className="table-responsive overflow-auto">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Country</th>
                    <th>Qualification</th>
                    <th>Course of Study</th>
                    <th>Duration (in Years)</th>
                    <th>Total Annual Tuition Fee</th>
                    <th>Hostel, Mess and Other Fees</th>
                    <th>Total Annual Fees</th>
                    <th>Special Scholarship from Institute</th>
                    <th>MU President's Special Scholarship</th>
                    <th>Net Annual Fee Payable</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student, index) => (
                    <tr key={index}>
                      <td>{student.studentId}</td>
                      <td>{student.studentName}</td>
                      <td>{student.countryName}</td>
                      <td>{student.qualification}</td>
                      <td>{student.courseOfStudy}</td>
                      <td>{student.duration}</td>
                      <td>{student.totalAnnualTuitionFee}</td>
                      <td>{student.hostelMessAndOtherFees}</td>
                      <td>{student.totalAnnualFees}</td>
                      <td>{student.specialScholarshipFromInstitute}</td>
                      <td>{student.MUPresidentsSpecialScholarship}</td>
                      <td>{student.netAnnualFeePayable}</td>
                      <td className="d-grid gap-2">
                        <EditButton
                          studentOrCourse="student"
                          id={student._id}
                        />
                        <DeleteButton
                          studentOrCourse="student"
                          id={student._id}
                          onDelete={handleDelete}
                        />
                      </td>
                      <td>
                        <OfferLetterButton studentData={student} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
