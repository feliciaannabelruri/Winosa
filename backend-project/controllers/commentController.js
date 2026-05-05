const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { blogId, name, message } = req.body;

    if (!blogId || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const comment = await Comment.create({ blogId, name, message });

    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blogId: req.params.blogId
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};