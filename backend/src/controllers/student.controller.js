import { Student } from "../models/student.model.js";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  const studentData = req.body;
  try {
    const createdStudent = await Student.create(studentData);
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student by ID
export const updateStudentById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student by ID
export const deleteStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHighestStudentId = async (req, res) => {
  try {
    const highestStudent = await Student.findOne({}, { studentId: 1 }) // Get only the studentId field
      .sort({ studentId: -1 }) // Sort in descending order of studentId
      .lean() // Use lean() to return plain JavaScript objects instead of Mongoose documents
      .exec();

    if (!highestStudent) {
      return res.status(404).json({ error: "No student found" });
    }

    res.json({ highestId: highestStudent.studentId }); // Return the highest student ID
  } catch (error) {
    console.error("Error fetching highest student ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
