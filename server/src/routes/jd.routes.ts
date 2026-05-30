import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth.middleware';
import JDTemplate from '../models/JDTemplate.model';

const router = Router();

router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const templates = await JDTemplate.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { title, company, description, tags } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description required' });
      return;
    }
    const template = await JDTemplate.create({
      userId: req.userId, title, company, description,
      tags: tags || [],
    });
    res.status(201).json({ template });
  } catch (err) {
    res.status(500).json({ message: 'Save failed' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    await JDTemplate.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;