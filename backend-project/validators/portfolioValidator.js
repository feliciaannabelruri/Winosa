const { z } = require('zod');

const portfolioFields = {
  // Basic
  title:       z.string().min(3, 'Title must be at least 3 characters'),
  slug:        z.string().min(3, 'Slug must be at least 3 characters'),
  category:    z.string().optional(),
  isPublished: z.boolean().optional(),
  isActive:    z.boolean().optional(),

  // Descriptions
  shortDesc:   z.string().optional(),
  longDesc:    z.string().optional(),
  description: z.string().optional(), // legacy

  // Images
  thumbnail:   z.string().url().optional().or(z.literal('')),
  heroImage:   z.string().url().optional().or(z.literal('')),
  image:       z.string().url().optional().or(z.literal('')), // legacy

  // Project info
  client:      z.string().optional(),
  year:        z.string().optional(),
  duration:    z.string().optional(),
  role:        z.string().optional(),
  projectUrl:  z.string().url().optional().or(z.literal('')),

  // Arrays
  techStack:   z.array(z.string()).optional(),
  gallery:     z.array(z.string()).optional(),
  metrics:     z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),

  // Case study
  challenge:   z.string().optional(),
  solution:    z.string().optional(),
  result:      z.string().optional(),
};

// Create — title & slug wajib
exports.createPortfolioSchema = z.object({
  ...portfolioFields,
}).passthrough(); // izinkan field extra tanpa error

// Update — semua optional
exports.updatePortfolioSchema = z.object(
  Object.fromEntries(
    Object.entries(portfolioFields).map(([k, v]) => [k, v.optional()])
  )
).passthrough();