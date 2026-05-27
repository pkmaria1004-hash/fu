export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, mediaType } = req.body;

  if (!image) {
    return res.status(400).json({ error: '이미지가 없습니다.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `당신은 고령층을 위해 카페·식당 키오스크 화면을 아주 쉽게 설명해주는 전문가입니다.
이 키오스크 화면을 보고 JSON만 출력하세요. 다른 텍스트는 절대 쓰지 마세요.

{
  "title": "화면 이름 (예: 음료 선택 화면)",
  "main": "이 화면이 무엇인지, 무엇을 해야 하는지 쉬운 말로 2문장",
  "steps": ["첫 번째 할 일", "두 번째 할 일", "세 번째 할 일"],
  "tips": ["팁1", "팁2", "팁3"],
  "warning": "주의사항 (없으면 빈 문자열)"
}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'API 오류' });
    }

    const raw = (data.content || []).map((c) => c.text || '').join('');
    const jsonStr = raw.replace(/```[\s\S]*?```/g, '').replace(/`/g, '').trim();
    const result = JSON.parse(jsonStr);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
