const { z } = require('zod');

// Create Portfolio Validation
exports.createPortfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  projectUrl: z.string().url('Project URL must be a valid URL').optional(),
  isActive: z.boolean().optional()
});

// Update Portfolio Validation (semua field optional)
exports.updatePortfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  projectUrl: z.string().url('Project URL must be a valid URL').optional(),
  isActive: z.boolean().optional()
});