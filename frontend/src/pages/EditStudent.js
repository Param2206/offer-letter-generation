import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const EditStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    countryName: "",
    qualification: "",
    courseOfStudy: "",
    duration: 0,
    totalAnnualTuitionFee: 0,
    hostelMessAndOtherFees: 0,
    totalAnnualFees: 0,
    specialScholarshipFromInstitute: 0,
    MUPresidentsSpecialScholarship: 0,
    netAnnualFeePayable: 0,
  });

  const [courses, setCourses] = useState([]);
  const [uniqueQualifications, setUniqueQualifications] = useState([]);
  const [correspondingCourses, setCorrespondingCourses] = useState([]);
  const [countryNames, setCountryNames] = useState([]);
  const studentId = useParams().studentId;

  const initialFetchRef = useRef({
    countries: true,
    courses: true,
    student: true,
  });

  useEffect(() => {
    if (initialFetchRef.current.countries) {
      initialFetchRef.current.countries = false;
      const fetchCountries = async () => {
        try {
          const response = await axios.get(
            "https://restcountries.com/v3.1/all"
          );
          const names = response.data.map((country) => country.name.common);
          names.sort((a, b) => a.localeCompare(b));
          setCountryNames(names);
        } catch (error) {
          toast.error("Error fetching countries");
        }
      };

      fetchCountries();
    }
  }, []);

  useEffect(() => {
    if (initialFetchRef.current.courses) {
      initialFetchRef.current.courses = false;
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${process.env.BASE_URL}/api/courses/get`);
          setCourses(response.data);
        } catch (error) {
          toast.error("Error fetching courses");
        }
      };

      fetchCourses();
    }
  }, []);

  useEffect(() => {
    if (initialFetchRef.current.student) {
      initialFetchRef.current.student = false;
      const fetchStudent = async () => {
        try {
          const response = await axios.get(`${process.env.BASE_URL}/api/students/get/${studentId}`);
          setFormData(response.data);
        } catch (error) {
          toast.error("Error fetching student");
        }
      };

      fetchStudent();
    }
  }, [studentId]);

  useEffect(() => {
    getUniqueQualifications();
  }, [courses]);

  useEffect(() => {
    getCorrespondingCourses(formData.qualification);
  }, [formData.qualification]);

  useEffect(() => {
    if (
      formData.courseOfStudy !== "" &&
      formData.courseOfStudy !== "Select a course"
    ) {
      const selectedCourse = courses.find(
        (course) => course.courseName === formData.courseOfStudy
      );
      if (selectedCourse) {
        setFormData((prev) => ({
          ...prev,
          duration: selectedCourse.duration,
          totalAnnualTuitionFee: selectedCourse.totalAnnualTuitionFee,
          hostelMessAndOtherFees: selectedCourse.hostelMessAndOtherFees,
          totalAnnualFees: selectedCourse.totalAnnualFees,
          specialScholarshipFromInstitute:
            selectedCourse.specialScholarshipFromInstitute,
          MUPresidentsSpecialScholarship:
            selectedCourse.MUPresidentsSpecialScholarship,
          netAnnualFeePayable: selectedCourse.netAnnualFeePayable,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        duration: 0,
        totalAnnualTuitionFee: 0,
        hostelMessAndOtherFees: 0,
        totalAnnualFees: 0,
        specialScholarshipFromInstitute: 0,
        MUPresidentsSpecialScholarship: 0,
        netAnnualFeePayable: 0,
      }));
    }
  }, [formData.courseOfStudy, courses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUniqueQualifications = () => {
    setUniqueQualifications([
      ...new Set(courses.map((course) => course.qualification)),
    ]);
  };

  const getCorrespondingCourses = (qualification) => {
    if (qualification !== "" && qualification !== "Select a qualification") {
      setCorrespondingCourses(
        courses.filter((course) => course.qualification === qualification)
      );
    }
  };

  const handleGenerateOfferLetter = async () => {
    try {
      const studentId = formData.studentId;
      const fileName = studentId
        .substring(studentId.length - 3)
        .replace(/^0+/, "");

      const response = await axios.post(`${process.env.BASE_URL}/api/pdf/generate`, formData, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error generating offer letter");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.BASE_URL}/api/students/update/${studentId}`, formData);

      handleGenerateOfferLetter();
      toast.success("Student updated and offer letter generated successfully");
    } catch (error) {
      toast.error("Error updating student");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h1 className="h2 mb-4">Edit Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-4">
          <h2 className="h5 mb-3">Personal Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="studentId" className="d-block mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                className="form-control d-block"
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="studentName" className="d-block mb-1">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="countryName" className="d-block mb-1">
                Country
              </label>
              <select
                id="countryName"
                name="countryName"
                value={formData.countryName}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a country</option>
                {countryNames.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h2 className="h5 mb-3">Academic Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="qualification" className="d-block mb-1">
                Qualification
              </label>
              <select
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a qualification</option>
                {uniqueQualifications.map((qualification, index) => (
                  <option key={index} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="courseOfStudy" className="d-block mb-1">
                Course
              </label>
              <select
                id="courseOfStudy"
                name="courseOfStudy"
                value={formData.courseOfStudy}
                onChange={handleInputChange}
                className="form-select d-block"
                required
              >
                <option value="">Select a course</option>
                {correspondingCourses.map((course, index) => (
                  <option key={index} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="duration" className="d-block mb-1">
                Duration (in years)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h2 className="h5 mb-3">Fee Information</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualTuitionFee" className="d-block mb-1">
                Total Annual Tuition Fee
              </label>
              <input
                type="number"
                id="totalAnnualTuitionFee"
                name="totalAnnualTuitionFee"
                value={formData.totalAnnualTuitionFee}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="hostelMessAndOtherFees" className="d-block mb-1">
                Hostel, Mess & Other Fees
              </label>
              <input
                type="number"
                id="hostelMessAndOtherFees"
                name="hostelMessAndOtherFees"
                value={formData.hostelMessAndOtherFees}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="totalAnnualFees" className="d-block mb-1">
                Total Annual Fees
              </label>
              <input
                type="number"
                id="totalAnnualFees"
                name="totalAnnualFees"
                value={formData.totalAnnualFees}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label
                htmlFor="specialScholarshipFromInstitute"
                className="d-block mb-1"
              >
                Special Scholarship from Institute
              </label>
              <input
                type="number"
                id="specialScholarshipFromInstitute"
                name="specialScholarshipFromInstitute"
                value={formData.specialScholarshipFromInstitute}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label
                htmlFor="MUPresidentsSpecialScholarship"
                className="d-block mb-1"
              >
                MU President's Special Scholarship
              </label>
              <input
                type="number"
                id="MUPresidentsSpecialScholarship"
                name="MUPresidentsSpecialScholarship"
                value={formData.MUPresidentsSpecialScholarship}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="netAnnualFeePayable" className="d-block mb-1">
                Net Annual Fee Payable
              </label>
              <input
                type="number"
                id="netAnnualFeePayable"
                name="netAnnualFeePayable"
                value={formData.netAnnualFeePayable}
                onChange={handleInputChange}
                className="form-control d-block"
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn mb-3">
          Update Student
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
