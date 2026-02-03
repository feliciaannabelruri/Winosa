const { z } = require('zod');

// Create Blog Validation
exports.createBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(5, 'Slug must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  author: z.string().min(3, 'Author name must be at least 3 characters').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional()
});

// Update Blog Validation (semua field optional)
exports.updateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  slug: z.string().min(5, 'Slug must be at least 5 characters').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters').optional(),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  author: z.string().min(3, 'Author name must be at least 3 characters').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional()
});