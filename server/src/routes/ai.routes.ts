import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth.middleware';
import { scoreResume, generateInterviewQuestions, scoreAnswer, generateRoadmap, callAI } from '../services/gemini.service';
import Resume from '../models/Resume.model';
import Score from '../models/Score.model';

const router = Router();

// POST /api/ai/score — score resume vs job description
router.post('/score', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { resumeId, jobDescription, jobTitle } = req.body;
    if (!resumeId || !jobDescription) {
      res.status(400).json({ message: 'resumeId and jobDescription required' });
      return;
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    if (!resume.extractedText || resume.extractedText.length < 50) {
      res.status(400).json({ message: 'Resume text could not be extracted' });
      return;
    }

    const result = await scoreResume(resume.extractedText, jobDescription);

    const score = await Score.create({
      userId: req.userId,
      resumeId,
      jobDescription,
      jobTitle: jobTitle || 'Not specified',
      ...result,
    });

    res.json({ score });
  } catch (err) {
    console.error('Score error:', err);
    res.status(500).json({ message: 'Scoring failed', error: String(err) });
  }
});

// GET /api/ai/scores — get all scores for user
router.get('/scores', protect, async (req: AuthRequest, res: Response) => {
  try {
    const scores = await Score.find({ userId: req.userId })
      .populate('resumeId', 'filename')
      .sort({ createdAt: -1 });
    res.json({ scores });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// POST /api/ai/interview/questions — generate questions
router.post('/interview/questions', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    const result = await generateInterviewQuestions(resume.extractedText, jobDescription);
    res.json(result);
  } catch (err) {
    console.error('Interview gen error:', err);
    res.status(500).json({ message: 'Failed to generate questions', error: String(err) });
  }
});

// POST /api/ai/interview/score-answer — score one answer
router.post('/interview/score-answer', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, hint } = req.body;
    const result = await scoreAnswer(question, answer, hint);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to score answer', error: String(err) });
  }
});

// POST /api/ai/roadmap
router.post('/roadmap', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { missingKeywords, jobTitle } = req.body
    const result = await generateRoadmap(missingKeywords, jobTitle)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Roadmap generation failed', error: String(err) })
  }
});

// POST /api/ai/resume-tips
router.post('/resume-tips', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { jobTitle, experienceLevel } = req.body
    const prompt = `You are an expert resume writer.
Return ONLY valid JSON (no markdown, no backticks).

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}

Return:
{
  "tips": [
    {
      "category": "Summary",
      "tip": "specific tip",
      "example": "concrete example",
      "priority": "high|medium|low"
    }
  ],
  "keywords": ["keyword1", "keyword2"],
  "commonMistakes": ["mistake1", "mistake2"],
  "actionVerbs": ["verb1", "verb2"]
}
Generate 8 tips across categories: Summary, Experience, Skills, Education, Formatting, ATS, Achievements, Soft Skills.`

    const text = await callAI(prompt)
    const clean = text.replace(/```json|```/g, '').trim()
    res.json(JSON.parse(clean))
  } catch (err) {
    res.status(500).json({ message: 'Tips generation failed', error: String(err) })
  }
});

export default router;