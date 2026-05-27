// This file allows Vercel to recognize API routes
// In production, Vercel will use this structure

export default async (req, res) => {
  // This is a placeholder - the actual API routes are handled by the catch-all route
  res.status(404).json({ error: 'API endpoint not found' });
};
