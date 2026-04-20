require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const oldBlogsImages = {
  'getting-started-with-react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
  'nodejs-best-practices': 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800',
  'mongodb-tutorial': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
  'css-grid-layout': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800',
  'restful-api-design': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800'
};

async function fixOldBlogImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Updating old blog images to Unsplash...");
    for (const [slug, imageUrl] of Object.entries(oldBlogsImages)) {
      await Blog.updateOne({ slug: slug }, { $set: { image: imageUrl } });
    }
    
    console.log("✅ Successfully fixed broken images for the 5 old blogs!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating images:", err);
    process.exit(1);
  }
}

fixOldBlogImages();
