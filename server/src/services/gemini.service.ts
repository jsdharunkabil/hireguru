import Groq from 'groq-sdk';

function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in .env');
  return new Groq({ apiKey });
}

export async function callAI(prompt: string): Promise<string> {
  const groq = getGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2000,
  });
  return response.choices[0].message.content || '';
}

export async function scoreResume(resumeText: string, jobDescription: string) {
  const prompt = `You are an expert ATS and career coach.
Analyze this resume against the job description and return ONLY valid JSON (no markdown, no backticks, no explanation).

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY this JSON structure:
{
  "overallScore": 75,
  "atsScore": 70,
  "sections": { "experience": 80, "skills": 70, "education": 75, "formatting": 80 },
  "matchedKeywords": ["React", "Node.js"],
  "missingKeywords": ["Docker", "AWS"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "summary": "Two sentence assessment here."
}`;

  const text = await callAI(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function generateInterviewQuestions(resumeText: string, jobDescription: string) {
  const prompt = `You are an expert technical interviewer.
Return ONLY valid JSON (no markdown, no backticks, no explanation).
Session: ${Date.now()} (generate unique questions each time)

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY this JSON:
{
  "questions": [
    { "id": "1", "category": "technical", "difficulty": "medium", "question": "question text", "hint": "hint text" },
    { "id": "2", "category": "technical", "difficulty": "hard", "question": "question text", "hint": "hint text" },
    { "id": "3", "category": "technical", "difficulty": "easy", "question": "question text", "hint": "hint text" },
    { "id": "4", "category": "behavioral", "difficulty": "medium", "question": "question text", "hint": "hint text" },
    { "id": "5", "category": "behavioral", "difficulty": "easy", "question": "question text", "hint": "hint text" },
    { "id": "6", "category": "behavioral", "difficulty": "medium", "question": "question text", "hint": "hint text" },
    { "id": "7", "category": "situational", "difficulty": "hard", "question": "question text", "hint": "hint text" },
    { "id": "8", "category": "situational", "difficulty": "medium", "question": "question text", "hint": "hint text" }
  ]
}

Generate exactly 8 questions based on the actual resume and job description content.`;

  const text = await callAI(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function scoreAnswer(question: string, answer: string, hint: string) {
  const prompt = `You are an expert interviewer scoring a candidate's answer.
Return ONLY valid JSON (no markdown, no backticks, no explanation).

QUESTION: ${question}
CANDIDATE ANSWER: ${answer}
IDEAL ANSWER SHOULD COVER: ${hint}

Return ONLY this JSON:
{
  "score": 7,
  "feedback": "specific feedback on their answer",
  "betterAnswer": "example of a stronger answer"
}`;

  const text = await callAI(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function generateRoadmap(missingKeywords: string[], jobTitle: string) {
  const prompt = `You are an expert career coach and learning advisor.
Return ONLY valid JSON (no markdown, no backticks).

Job Title: ${jobTitle}
Skills to learn: ${missingKeywords.join(', ')}

Create a 90-day learning roadmap. Return:
{
  "weeks": [
    {
      "week": 1,
      "phase": "Foundation",
      "focus": "main topic",
      "tasks": ["task1", "task2", "task3"],
      "resources": ["free resource 1", "free resource 2"]
    }
  ]
}
Generate 12 weeks total grouped into 3 phases: Foundation (weeks 1-4), Building (weeks 5-8), Advanced (weeks 9-12).`

  const text = await callAI(prompt)
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

