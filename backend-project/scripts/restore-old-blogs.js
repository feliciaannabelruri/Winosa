require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const blogs = [
  {
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    content: 'React is a JavaScript library for building user interfaces. In this guide, we will cover the basics...',
    excerpt: 'Learn the fundamentals of React development',
    image: 'https://via.placeholder.com/800x400',
    author: 'John Doe',
    tags: ['react', 'javascript', 'frontend'],
    isPublished: true
  },
  {
    title: 'Node.js Best Practices',
    slug: 'nodejs-best-practices',
    content: 'Node.js is a powerful runtime for building scalable applications. Here are some best practices...',
    excerpt: 'Essential tips for Node.js developers',
    image: 'https://via.placeholder.com/800x400',
    author: 'Jane Smith',
    tags: ['nodejs', 'backend', 'javascript'],
    isPublished: true
  },
  {
    title: 'MongoDB Tutorial',
    slug: 'mongodb-tutorial',
    content: 'MongoDB is a NoSQL database that stores data in flexible documents. Learn how to use it...',
    excerpt: 'Complete guide to MongoDB',
    image: 'https://via.placeholder.com/800x400',
    author: 'Mike Johnson',
    tags: ['mongodb', 'database', 'nosql'],
    isPublished: true
  },
  {
    title: 'CSS Grid Layout',
    slug: 'css-grid-layout',
    content: 'CSS Grid is a powerful layout system. Master it with this comprehensive guide...',
    excerpt: 'Master CSS Grid in 2024',
    image: 'https://via.placeholder.com/800x400',
    author: 'Sarah Lee',
    tags: ['css', 'frontend', 'design'],
    isPublished: true
  },
  {
    title: 'RESTful API Design',
    slug: 'restful-api-design',
    content: 'Learn how to design clean and scalable RESTful APIs following industry standards...',
    excerpt: 'Build better APIs',
    image: 'https://via.placeholder.com/800x400',
    author: 'Tom Brown',
    tags: ['api', 'rest', 'backend'],
    isPublished: true
  }
];

async function restoreOldBlogs() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Inserting the 5 original dummy blogs without deleting existing ones...");
    
    for (let blog of blogs) {
      // Use updateOne with upsert to avoid duplicate key errors if they already exist
      await Blog.updateOne({ slug: blog.slug }, { $set: blog }, { upsert: true });
    }
    
    console.log("✅ Successfully restored the 5 old blogs!");
    process.exit(0);
  } catch (err) {
    console.error("Error restoring blogs:", err);
    process.exit(1);
  }
}

restoreOldBlogs();
