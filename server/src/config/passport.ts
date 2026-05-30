import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'https://hireguru.onrender.com/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails?.[0].value });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        password: Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16),
      });
    }
    done(null, user);
  } catch (err) {
    done(err as Error, undefined);
  }
}));

export default passport;