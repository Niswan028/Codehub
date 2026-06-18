const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function analyzeCode(problemName, code) {
  const prompt = `You are a DSA expert. Analyze this LeetCode solution and return ONLY a valid JSON object (no markdown, no explanation) with exactly these fields:\n{\n  topic: string,\n  pattern: string,\n  timeComplexity: string,\n  spaceComplexity: string,\n  keyPoints: string[],\n  userTrick: string,\n  approachSummary: string\n}`;

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: `Problem: ${problemName}\n\nCode:\n${code}` },
    ],
    max_tokens: 800,
    temperature: 0.2,
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';

  try {
    const parsed = JSON.parse(content.trim());
    return parsed;
  } catch (error) {
    throw new Error('Failed to parse AI response as JSON.');
  }
}
