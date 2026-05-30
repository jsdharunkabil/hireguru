import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import passport from '../config/passport';

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

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const user = req.user as any
    const token = signToken(String(user._id))
    // Send token as httpOnly cookie instead of URL param
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    // Send user info (not token) in URL — safe to expose
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user._id}`
    )
  }
)

// New endpoint — exchange cookie for token
router.get('/google/token', (req, res) => {
  const token = req.cookies?.auth_token
  if (!token) { res.status(401).json({ message: 'No token' }); return }
  res.clearCookie('auth_token')
  res.json({ token })
})



export default router;