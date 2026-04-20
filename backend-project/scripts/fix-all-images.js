require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

async function fixAllImagesToPicsum() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Fetching all blogs...");
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs. Updating images to picsum...`);

    let count = 0;
    for (const blog of blogs) {
      const newImage = `https://picsum.photos/seed/${blog.slug}/800/400`;
      await Blog.updateOne({ _id: blog._id }, { $set: { image: newImage } });
      count++;
    }
    
    console.log(`✅ Successfully updated ${count} blog images to Picsum!`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating images:", err);
    process.exit(1);
  }
}

fixAllImagesToPicsum();
