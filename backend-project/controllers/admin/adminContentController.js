const TeamMember   = require('../../models/TeamMember');
const GlassContent = require('../../models/GlassContent');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');

// ── TEAM ──
exports.getTeam = asyncHandler(async (req, res) => {
  const members = await TeamMember.find().sort({ order: 1 });
  res.json({ success: true, data: members });
});

exports.addMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.create(req.body);
  res.status(201).json({ success: true, data: member });
});

exports.updateMember = asyncHandler(async (req, res, next) => {
  const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!member) return next(new ErrorResponse('Member not found', 404));
  res.json({ success: true, data: member });
});

exports.deleteMember = asyncHandler(async (req, res, next) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) return next(new ErrorResponse('Member not found', 404));
  res.json({ success: true, message: 'Member deleted' });
});

exports.reorderTeam = asyncHandler(async (req, res) => {
  const { orders } = req.body; // [{ _id, order }]
  await Promise.all(orders.map(({ _id, order }) => TeamMember.findByIdAndUpdate(_id, { order })));
  res.json({ success: true });
});

// ── GLASS ──
exports.getGlass = asyncHandler(async (req, res) => {
  let glass = await GlassContent.findOne();
  if (!glass) glass = await GlassContent.create({});
  res.json({ success: true, data: glass });
});

exports.updateGlass = asyncHandler(async (req, res) => {
  let glass = await GlassContent.findOne();
  if (!glass) glass = new GlassContent();
  Object.assign(glass, req.body);
  await glass.save();
  res.json({ success: true, data: glass });
});