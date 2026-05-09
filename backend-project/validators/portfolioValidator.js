const { z } = require('zod');

const testimonySchema = z.object({
  name:    z.string(),
  role:    z.string().optional(),
  content: z.string(),
  rating:  z.number().min(1).max(5),
});

const baseSchema = {
  title:        z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug:         z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description:  z.string().optional(),
  shortDesc:    z.string().optional(),
  longDesc:     z.string().optional(),
  image:        z.string().optional(),
  thumbnail:    z.string().optional(),
  heroImage:    z.string().optional(),
  category:     z.string().optional(),
  client:       z.string().optional(),
  year:         z.string().optional(),
  duration:     z.string().optional(),
  role:         z.string().optional(),
  projectUrl:   z.string().optional(),
  challenge:    z.string().optional(),
  solution:     z.string().optional(),
  result:       z.string().optional(),
  techStack:    z.array(z.string()).optional(),
  metrics:      z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  gallery:      z.array(z.string()).optional(),
  testimonials: z.array(testimonySchema).optional(),
  isActive:     z.union([z.boolean(), z.string()]).optional(),
};

exports.createPortfolioSchema = z.object({
  ...baseSchema,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug:  z.string().min(3, 'Slug must be at least 3 characters'),
}).passthrough();

exports.updatePortfolioSchema = z.object(baseSchema).passthrough();