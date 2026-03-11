const mongoose = require('mongoose');

const glassContentSchema = new mongoose.Schema({
  whoWeAre: { image1: { type: String, default: '' }, image2: { type: String, default: '' } },
  whatWeDo: { image1: { type: String, default: '' }, image2: { type: String, default: '' } },
  vision:   { image:  { type: String, default: '' } },
});

module.exports = mongoose.model('GlassContent', glassContentSchema);