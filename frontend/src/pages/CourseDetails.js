import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const CourseDetails = () => {
  const [filters, setFilters] = useState({
    qualification: [],
    duration: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [courseData, setCourseData] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showQualificationCollapse, setShowQualificationCollapse] =
    useState(false);
  const [showDurationCollapse, setShowDurationCollapse] = useState(false);

  const initialFetchRef = useRef(true);

  useEffect(() => {
    if (initialFetchRef.current) {
      initialFetchRef.current = false;
      async function fetchData() {
        try {
          const response = await axios.get("/api/courses/get");
          setCourseData(response.data);
        } catch (error) {
          toast.error("Error fetching courses");
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

  const handleDelete = (deletedCourseId) => {
    setCourseData((prev) =>
      prev.filter((courseData) => courseData._id !== deletedCourseId)
    );
  };

  const handleClearFilters = () => {
    setFilters({
      qualification: [],
      duration: [],
    });
  };

  const filteredCourses = courseData.filter((course) => {
    return (
      (filters.qualification.length === 0 ||
        filters.qualification.includes(course.qualification)) &&
      (filters.duration.length === 0 ||
        filters.duration.includes(course.duration.toString())) &&
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedCourses = filteredCourses.sort((a, b) =>
    a.courseName.localeCompare(b.courseName)
  );

  const coursesCount = sortedCourses.length;

  return (
    <>
      <ToastContainer />
      <div className="container-fluid mt-4">
        <h1 className="h2 mb-4">Course Details</h1>
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
                placeholder="Search by Course Name"
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
                  new Set(courseData.map((course) => course.qualification))
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
                  new Set(courseData.map((course) => course.duration))
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
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p>
              <b>Count:</b> {coursesCount}
            </p>
            <div className="table-responsive overflow-auto">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Qualification</th>
                    <th>Duration (in Years)</th>
                    <th>Total Annual Tuition Fee</th>
                    <th>Hostel, Mess and Other Fees</th>
                    <th>Total Annual Fees</th>
                    <th>Special Scholarship from Institute</th>
                    <th>MU President's Special Scholarship</th>
                    <th>Net Annual Fee Payable</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCourses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.courseName}</td>
                      <td>{course.qualification}</td>
                      <td>{course.duration}</td>
                      <td>{course.totalAnnualTuitionFee}</td>
                      <td>{course.hostelMessAndOtherFees}</td>
                      <td>{course.totalAnnualFees}</td>
                      <td>{course.specialScholarshipFromInstitute}</td>
                      <td>{course.MUPresidentsSpecialScholarship}</td>
                      <td>{course.netAnnualFeePayable}</td>
                      <td className="d-grid gap-2">
                        <EditButton studentOrCourse="course" id={course._id} />
                        <DeleteButton
                          studentOrCourse="course"
                          id={course._id}
                          onDelete={handleDelete}
                        />
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

export default CourseDetails;
