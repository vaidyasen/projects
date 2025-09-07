const express = require("express");
const Agent = require("../models/Agent");
const ListItem = require("../models/ListItem");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const agents = await Agent.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    console.error("Get agents error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res
        .status(400)
        .json({ message: "Agent already exists with this email" });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password,
    });

    await agent.save();

    // Return agent without password
    const agentResponse = await Agent.findById(agent._id).select("-password");

    res.status(201).json({
      message: "Agent created successfully",
      agent: agentResponse,
    });
  } catch (error) {
    console.error("Create agent error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/agents/:id
// @desc    Get a specific agent
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    console.error("Get agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/agents/:id
// @desc    Update an agent
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, mobile, isActive } = req.body;

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== agent.email) {
      const existingAgent = await Agent.findOne({ email });
      if (existingAgent) {
        return res
          .status(400)
          .json({ message: "Agent already exists with this email" });
      }
    }

    // Update fields
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (typeof isActive !== "undefined") agent.isActive = isActive;

    await agent.save();

    const updatedAgent = await Agent.findById(agent._id).select("-password");

    res.json({
      message: "Agent updated successfully",
      agent: updatedAgent,
    });
  } catch (error) {
    console.error("Update agent error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/agents/:id
// @desc    Delete an agent
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Also delete all list items assigned to this agent
    await ListItem.deleteMany({ assignedAgent: req.params.id });

    await Agent.findByIdAndDelete(req.params.id);

    res.json({ message: "Agent and associated data deleted successfully" });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/agents/:id/assignments
// @desc    Get all list items assigned to a specific agent
// @access  Private
router.get("/:id/assignments", authMiddleware, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const assignments = await ListItem.find({
      assignedAgent: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
      },
      assignments,
      totalAssignments: assignments.length,
    });
  } catch (error) {
    console.error("Get agent assignments error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
