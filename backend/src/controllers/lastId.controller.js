import { LastId } from "../models/lastId.model.js";

// Get last ID
export const getLastId = async (req, res) => {
  try {
    let lastId = await LastId.findOne();
    if (!lastId) {
      lastId = { lastStudentId: "INT/INT-KV/2023-24/000" }; // default ID format
    }
    res.status(200).json(lastId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update last ID
export const updateLastId = async (req, res) => {
  try {
    const { lastStudentId } = req.body;
    const lastId = await LastId.findOneAndUpdate(
      {},
      { lastStudentId },
      { new: true, upsert: true }
    );
    res.status(200).json(lastId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
