import Message from "../models/Message.js";

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error(`Error in createMessage: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(`Error in getMessages: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update message status (e.g., mark as read)
// @route   PUT /api/messages/:id/status
// @access  Private (Admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.status = status || message.status;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error(`Error in updateMessageStatus: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Reply to a message
// @route   PUT /api/messages/:id/reply
// @access  Private (Admin)
export const replyToMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (!reply) {
      return res.status(400).json({ success: false, message: "Reply text is required" });
    }

    message.reply = reply;
    message.status = "replied";
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error(`Error in replyToMessage: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
