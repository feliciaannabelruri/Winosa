require('dotenv').config();
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Subscription = require('../models/Subscription');
const connectDB = require('../config/db');

// Connect DB
connectDB();

// Dummy Portfolios (sama seperti sebelumnya)
const portfolios = [
  {
    title: 'E-Commerce Website',
    slug: 'ecommerce-website',
    description: 'Modern e-commerce platform with payment integration',
    image: 'https://via.placeholder.com/800x600',
    category: 'web',
    client: 'TechStore Inc',
    projectUrl: 'https://example.com',
    isActive: true
  },
  {
    title: 'Mobile Banking App',
    slug: 'mobile-banking-app',
    description: 'Secure mobile banking application',
    image: 'https://via.placeholder.com/800x600',
    category: 'mobile',
    client: 'BankXYZ',
    projectUrl: 'https://example.com',
    isActive: true
  },
  {
    title: 'Corporate Website',
    slug: 'corporate-website',
    description: 'Professional corporate website with CMS',
    image: 'https://via.placeholder.com/800x600',
    category: 'web',
    client: 'ABC Corporation',
    projectUrl: 'https://example.com',
    isActive: true
  },
  {
    title: 'Food Delivery App',
    slug: 'food-delivery-app',
    description: 'Real-time food delivery application',
    image: 'https://via.placeholder.com/800x600',
    category: 'mobile',
    client: 'FoodHub',
    projectUrl: 'https://example.com',
    isActive: true
  },
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'Creative portfolio for designers',
    image: 'https://via.placeholder.com/800x600',
    category: 'web',
    client: 'Designer Pro',
    projectUrl: 'https://example.com',
    isActive: true
  }
];

// Dummy Blogs (sama seperti sebelumnya)
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

// Dummy Services
const services = [
  {
    title: 'Web Development',
    slug: 'web-development',
    description: 'Custom website development with modern technologies',
    icon: 'code',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Secure'],
    price: 'Starting from $999',
    isActive: true
  },
  {
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: 'Native and cross-platform mobile applications',
    icon: 'mobile',
    features: ['iOS & Android', 'User-Friendly UI', 'Push Notifications', 'Offline Support'],
    price: 'Starting from $1,999',
    isActive: true
  },
  {
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Beautiful and intuitive user interface design',
    icon: 'palette',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    price: 'Starting from $499',
    isActive: true
  },
  {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Grow your business with effective digital strategies',
    icon: 'trending-up',
    features: ['SEO', 'Social Media', 'Content Marketing', 'Email Campaigns'],
    price: 'Starting from $299/month',
    isActive: true
  },
  {
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-solutions',
    description: 'Complete online store setup and management',
    icon: 'shopping-cart',
    features: ['Payment Integration', 'Inventory Management', 'Analytics', 'Customer Support'],
    price: 'Starting from $1,499',
    isActive: true
  }
];

// Dummy Subscriptions
const subscriptions = [
  {
    name: 'Basic Plan',
    price: 29,
    duration: 'monthly',
    features: [
      '5 Projects',
      'Basic Support',
      '10GB Storage',
      'Community Access'
    ],
    isPopular: false,
    isActive: true
  },
  {
    name: 'Pro Plan',
    price: 79,
    duration: 'monthly',
    features: [
      'Unlimited Projects',
      'Priority Support',
      '100GB Storage',
      'Advanced Analytics',
      'Team Collaboration',
      'Custom Domain'
    ],
    isPopular: true,
    isActive: true
  },
  {
    name: 'Enterprise Plan',
    price: 199,
    duration: 'monthly',
    features: [
      'Unlimited Everything',
      '24/7 Dedicated Support',
      '1TB Storage',
      'Advanced Security',
      'Custom Integrations',
      'SLA Guarantee',
      'Training & Onboarding'
    ],
    isPopular: false,
    isActive: true
  }
];

// Import Data
const importData = async () => {
  try {
    // Clear existing data
    await Portfolio.deleteMany();
    await Blog.deleteMany();
    await Service.deleteMany();
    await Subscription.deleteMany();

    // Insert new data
    await Portfolio.insertMany(portfolios);
    await Blog.insertMany(blogs);
    await Service.insertMany(services);
    await Subscription.insertMany(subscriptions);

    console.log('Data Imported Successfully!');
    console.log(`- ${portfolios.length} Portfolios`);
    console.log(`- ${blogs.length} Blogs`);
    console.log(`- ${services.length} Services`);
    console.log(`- ${subscriptions.length} Subscriptions`);
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Portfolio.deleteMany();
    await Blog.deleteMany();
    await Service.deleteMany();
    await Subscription.deleteMany();

    console.log('Data Deleted Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Run script
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}