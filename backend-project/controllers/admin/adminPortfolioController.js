const Portfolio = require('../../models/Portfolio');

// GET all
const getAllPortfolios = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isActive } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const portfolios = await Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Portfolio.countDocuments(filter);
    res.json({ success: true, data: portfolios, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by ID
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE — menerima JSON (gambar sudah diupload via /api/admin/upload, dikirim sebagai URL)
const createPortfolio = async (req, res) => {
  try {
    const {
      title, slug, shortDesc, longDesc, category, isActive,
      thumbnail, heroImage, client, year, duration, role,
      techStack, challenge, solution, result, metrics, gallery, projectUrl,
    } = req.body;

    const exists = await Portfolio.findOne({ slug });
    if (exists) return res.status(400).json({ success: false, message: 'Slug already exists' });

    const portfolio = await Portfolio.create({
      title, slug,
      shortDesc:  shortDesc  ?? '',
      longDesc:   longDesc   ?? '',
      category:   category   ?? '',
      isActive:   isActive   ?? true,
      thumbnail:  thumbnail  ?? '',
      heroImage:  heroImage  ?? '',
      client:     client     ?? '',
      year:       year       ?? '',
      duration:   duration   ?? '',
      role:       role       ?? '',
      techStack:  Array.isArray(techStack) ? techStack : [],
      challenge:  challenge  ?? '',
      solution:   solution   ?? '',
      result:     result     ?? '',
      metrics:    Array.isArray(metrics) ? metrics : [],
      gallery:    Array.isArray(gallery) ? gallery : [],
      projectUrl: projectUrl ?? '',
    });

    res.status(201).json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
const updatePortfolio = async (req, res) => {
  try {
    const allowedFields = [
      'title', 'slug', 'shortDesc', 'longDesc', 'category', 'isActive',
      'thumbnail', 'heroImage', 'client', 'year', 'duration', 'role',
      'techStack', 'challenge', 'solution', 'result', 'metrics', 'gallery', 'projectUrl',
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!portfolio) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};