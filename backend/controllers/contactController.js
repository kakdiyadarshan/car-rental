const Contact = require("../models/contactModel");
const asyncHandler = require("express-async-handler");

// @desc    Create new contact message
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  if (contact) {
    res.status(201).json({ message: "Message sent successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.deleteOne();
    res.json({ message: "Message removed" });
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

module.exports = {
  createContact,
  getContacts,
  deleteContact,
};
