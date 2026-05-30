import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';


const router = Router();

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  } as jwt.SignOptions);

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }
    const user = await User.create({ name, email, password });
    const token = signToken(String(user._id));
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    const token = signToken(String(user._id));
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});



// New endpoint — exchange cookie for token
router.get('/google/token', (req, res) => {
  const token = req.cookies?.auth_token
  if (!token) { res.status(401).json({ message: 'No token' }); return }
  res.clearCookie('auth_token')
  res.json({ token })
})



export default router;