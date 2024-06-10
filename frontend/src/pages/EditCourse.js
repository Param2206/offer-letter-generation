import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCourse = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    courseName: "",
    qualification: "",
    duration: 0,
    totalAnnualTuitionFee: 0,
    hostelMessAndOtherFees: 0,
    totalAnnualFees: 0,
    specialScholarshipFromInstitute: 0,
    MUPresidentsSpecialScholarship: 0,
    netAnnualFeePayable: 0,
  });

  const [initialCourseData, setInitialCourseData] = useState(null);
  const initialFetchRef = useRef(true);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (initialFetchRef.current) {
      initialFetchRef.current = false;
      async function fetchCourse() {
        try {
          const response = await axios.get(`${process.env.BASE_URL}/api/courses/get/${courseId}`);
          setCourseData(response.data);
          setInitialCourseData(response.data);
        } catch (error) {
          toast.error("Error fetching course");
        }
      }
      fetchCourse();
    }
  }, [courseId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (JSON.stringify(courseData) === JSON.stringify(initialCourseData)) {
      toast.info("Nothing to update");
      return;
    }
    try {
      await axios.put(`${process.env.BASE_URL}/api/courses/update/${courseId}`, courseData);
      toast.success("Course updated successfully");
    } catch (error) {
      toast.error("Error updating course");
    }
  };

  const calculateTotalAnnualFees = () => {
    const totalAnnualTuitionFee = parseInt(courseData.totalAnnualTuitionFee);
    const hostelMessAndOtherFees = parseInt(courseData.hostelMessAndOtherFees);
    const totalAnnualFees = totalAnnualTuitionFee + hostelMessAndOtherFees;
    setCourseData({ ...courseData, totalAnnualFees });
  };

  const calculateNetAnnualFeePayable = () => {
    const totalAnnualFees = parseInt(courseData.totalAnnualFees);
    const specialScholarshipFromInstitute = parseInt(
      courseData.specialScholarshipFromInstitute
    );
    const MUPresidentsSpecialScholarship = parseInt(
      courseData.MUPresidentsSpecialScholarship
    );
    const netAnnualFeePayable =
      totalAnnualFees -
      specialScholarshipFromInstitute -
      MUPresidentsSpecialScholarship;
    setCourseData({ ...courseData, netAnnualFeePayable });
  };

  useEffect(() => {
    calculateTotalAnnualFees();
  }, [courseData.totalAnnualTuitionFee, courseData.hostelMessAndOtherFees]);

  useEffect(() => {
    calculateNetAnnualFeePayable();
  }, [
    courseData.totalAnnualFees,
    courseData.specialScholarshipFromInstitute,
    courseData.MUPresidentsSpecialScholarship,
  ]);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="h2 mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Course Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="courseName" className="form-label mb-1">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                id="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="qualification" className="form-label mb-1">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                id="qualification"
                value={courseData.qualification}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="duration" className="form-label mb-1">
                Duration (in Years)
              </label>
              <input
                type="number"
                name="duration"
                id="duration"
                value={courseData.duration}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
              />
            </div>
          </div>
        </div>
        <div className="card p-4 mb-md-4 mb-3">
          <h2 className="h5 mb-3">Fee Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label
                htmlFor="totalAnnualTuitionFee"
                className="form-label mb-1"
              >
                Total Annual Tuition Fee
              </label>
              <input
                type="number"
                name="totalAnnualTuitionFee"
                id="totalAnnualTuitionFee"
                value={courseData.totalAnnualTuitionFee}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label
                htmlFor="hostelMessAndOtherFees"
                className="form-label mb-1"
              >
                Hostel, Mess, and Other Fees
              </label>
              <input
                type="number"
                name="hostelMessAndOtherFees"
                id="hostelMessAndOtherFees"
                value={courseData.hostelMessAndOtherFees}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualFees" className="form-label mb-1">
                Total Annual Fees
              </label>
              <input
                type="number"
                name="totalAnnualFees"
                id="totalAnnualFees"
                value={courseData.totalAnnualFees}
                onChange={handleChange}
                className="form-control"
                readOnly
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label
                htmlFor="specialScholarshipFromInstitute"
                className="form-label mb-1"
              >
                Special Scholarship From Institute
              </label>
              <input
                type="number"
                name="specialScholarshipFromInstitute"
                id="specialScholarshipFromInstitute"
                value={courseData.specialScholarshipFromInstitute}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label
                htmlFor="MUPresidentsSpecialScholarship"
                className="form-label mb-1"
              >
                MU President's Special Scholarship
              </label>
              <input
                type="number"
                name="MUPresidentsSpecialScholarship"
                id="MUPresidentsSpecialScholarship"
                value={courseData.MUPresidentsSpecialScholarship}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="netAnnualFeePayable" className="form-label mb-1">
                Net Annual Fee Payable
              </label>
              <input
                type="number"
                name="netAnnualFeePayable"
                id="netAnnualFeePayable"
                value={courseData.netAnnualFeePayable}
                onChange={handleChange}
                className="form-control"
                readOnly
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn mb-3">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
