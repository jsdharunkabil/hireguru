import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { protect, AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';

const router = Router();

// GET /api/user/profile
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/user/profile
router.patch('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    if (name) user.name = name;

    if (currentPassword && newPassword) {
      const valid = await user.comparePassword(currentPassword);
      if (!valid) { res.status(400).json({ message: 'Current password incorrect' }); return; }
      user.password = newPassword;
    }

    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

export default router;