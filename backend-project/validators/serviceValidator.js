const { z } = require('zod');

exports.createServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
  price: z.string().optional(),
  isActive: z.boolean().optional()
});

exports.updateServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
  price: z.string().optional(),
  isActive: z.boolean().optional()
});