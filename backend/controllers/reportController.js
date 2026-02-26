import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { name, email, location, wasteType, description } = req.body;

    const photoUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const report = await Report.create({
      name,
      email,
      location,
      wasteType,
      description,
      photo: photoUrl,
    });

    res.status(201).json({
      message: "Report submitted successfully ✅",
      report,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};