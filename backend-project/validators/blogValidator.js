const { z } = require('zod');

// Create Blog Validation
exports.createBlogSchema = z.object({
  title:       z.string().min(5, 'Title minimal 5 karakter'),
  slug:        z.string().min(5, 'Slug minimal 5 karakter'),
  content:     z.string().min(10, 'Content minimal 10 karakter'),
  excerpt:     z.string().optional().or(z.literal('')),
  image:       z.string().optional().or(z.literal('')),
  author:      z.string().optional().or(z.literal('')),
  tags:        z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

// Update Blog Validation (semua optional)
exports.updateBlogSchema = z.object({
  title:       z.string().min(5, 'Title minimal 5 karakter').optional(),
  slug:        z.string().min(5, 'Slug minimal 5 karakter').optional(),
  content:     z.string().min(10, 'Content minimal 10 karakter').optional(),
  excerpt:     z.string().optional().or(z.literal('')),
  image:       z.string().optional().or(z.literal('')),
  author:      z.string().optional().or(z.literal('')),
  tags:        z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});