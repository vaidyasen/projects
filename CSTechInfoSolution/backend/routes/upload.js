const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Agent = require("../models/Agent");
const ListItem = require("../models/ListItem");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV, XLSX, and XLS files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Convert keys to lowercase and trim spaces
        const cleanData = {};
        Object.keys(data).forEach((key) => {
          const cleanKey = key.toLowerCase().trim().replace(/\s+/g, "");
          cleanData[cleanKey] = data[key] ? data[key].trim() : "";
        });
        results.push(cleanData);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

// Function to parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Convert keys to lowercase and trim spaces
    return data.map((row) => {
      const cleanData = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.toLowerCase().trim().replace(/\s+/g, "");
        cleanData[cleanKey] = row[key] ? row[key].toString().trim() : "";
      });
      return cleanData;
    });
  } catch (error) {
    throw new Error("Error parsing Excel file: " + error.message);
  }
};

// Function to validate data structure
const validateData = (data) => {
  const requiredFields = ["firstname", "phone"];
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("File is empty or invalid");
    return { isValid: false, errors };
  }

  data.forEach((row, index) => {
    requiredFields.forEach((field) => {
      if (!row[field] || row[field].trim() === "") {
        errors.push(`Row ${index + 1}: Missing ${field}`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Function to distribute data among agents
const distributeData = async (data, batchId) => {
  try {
    // Get all active agents
    const agents = await Agent.find({ isActive: true });

    if (agents.length === 0) {
      throw new Error("No active agents found. Please create agents first.");
    }

    if (agents.length < 5) {
      throw new Error("At least 5 agents are required for distribution");
    }

    // Use only first 5 agents for distribution
    const selectedAgents = agents.slice(0, 5);
    const itemsPerAgent = Math.floor(data.length / 5);
    const remainderItems = data.length % 5;

    const distributions = [];
    let currentIndex = 0;

    for (let i = 0; i < 5; i++) {
      const agent = selectedAgents[i];
      let itemsForThisAgent = itemsPerAgent;

      // Distribute remainder items sequentially
      if (i < remainderItems) {
        itemsForThisAgent += 1;
      }

      const agentItems = data.slice(
        currentIndex,
        currentIndex + itemsForThisAgent
      );

      // Create list items for this agent
      const listItems = agentItems.map((item) => ({
        firstName: item.firstname,
        phone: item.phone,
        notes: item.notes || "",
        assignedAgent: agent._id,
        uploadBatch: batchId,
      }));

      distributions.push({
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
        },
        items: listItems,
        count: itemsForThisAgent,
      });

      currentIndex += itemsForThisAgent;
    }

    // Save all list items to database
    const allListItems = distributions.flatMap((d) => d.items);
    await ListItem.insertMany(allListItems);

    return distributions;
  } catch (error) {
    throw new Error("Error distributing data: " + error.message);
  }
};

// @route   POST /api/upload
// @desc    Upload and process CSV/Excel file
// @access  Private
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    let data;

    // Parse file based on extension
    if (fileExtension === ".csv") {
      data = await parseCSV(filePath);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      data = parseExcel(filePath);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Unsupported file format" });
    }

    // Validate data structure
    const validation = validateData(data);
    if (!validation.isValid) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "Invalid file format or data",
        errors: validation.errors,
      });
    }

    // Generate unique batch ID
    const batchId =
      Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9);

    // Distribute data among agents
    const distributions = await distributeData(data, batchId);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: "File uploaded and distributed successfully",
      batchId,
      totalItems: data.length,
      distributions: distributions.map((d) => ({
        agent: d.agent,
        count: d.count,
      })),
      summary: {
        totalAgents: distributions.length,
        itemsPerAgent: distributions.map((d) => d.count),
      },
    });
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: error.message || "Server error during upload" });
  }
});

// @route   GET /api/upload/distributions
// @desc    Get all distributions
// @access  Private
router.get("/distributions", authMiddleware, async (req, res) => {
  try {
    // Get all list items grouped by upload batch and agent
    const distributions = await ListItem.aggregate([
      {
        $lookup: {
          from: "agents",
          localField: "assignedAgent",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $group: {
          _id: {
            batchId: "$uploadBatch",
            agentId: "$assignedAgent",
          },
          agent: { $first: "$agent" },
          items: { $push: "$$ROOT" },
          count: { $sum: 1 },
          batchId: { $first: "$uploadBatch" },
        },
      },
      {
        $group: {
          _id: "$batchId",
          batchId: { $first: "$batchId" },
          distributions: {
            $push: {
              agent: {
                id: "$agent._id",
                name: "$agent.name",
                email: "$agent.email",
              },
              count: "$count",
              items: "$items",
            },
          },
          totalItems: { $sum: "$count" },
        },
      },
      {
        $sort: { batchId: -1 },
      },
    ]);

    res.json(distributions);
  } catch (error) {
    console.error("Get distributions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/upload/distributions/:batchId
// @desc    Get specific distribution by batch ID
// @access  Private
router.get("/distributions/:batchId", authMiddleware, async (req, res) => {
  try {
    const { batchId } = req.params;

    const items = await ListItem.find({ uploadBatch: batchId })
      .populate("assignedAgent", "name email")
      .sort({ createdAt: 1 });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No distribution found with this batch ID" });
    }

    // Group items by agent
    const distributionMap = {};
    items.forEach((item) => {
      const agentId = item.assignedAgent._id.toString();
      if (!distributionMap[agentId]) {
        distributionMap[agentId] = {
          agent: {
            id: item.assignedAgent._id,
            name: item.assignedAgent.name,
            email: item.assignedAgent.email,
          },
          items: [],
          count: 0,
        };
      }
      distributionMap[agentId].items.push(item);
      distributionMap[agentId].count++;
    });

    const distributions = Object.values(distributionMap);

    res.json({
      batchId,
      totalItems: items.length,
      distributions,
    });
  } catch (error) {
    console.error("Get distribution error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
