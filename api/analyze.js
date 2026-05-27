export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { image, mediaType } = req.body;
  if (!image) return res.status(400).json({ error: '이미지가 없습니다.' });
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
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
          { type: 'text', text: '고령층을 위해 이 키오스크 화면을 쉽게 설명해주세요. JSON만 출력하세요:\n{"title":"화면이름","main":"설명2문장","steps":["할일1","할일2","할일3"],"tips":["팁1","팁2","팁3"],"warning":"주의사항또는빈문자열"}' }
        ]}]
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'API 오류' });
    const raw = (data.content || []).map(c => c.text || '').join('');
    const result = JSON.parse(raw.replace(/```[\s\S]*?```/g, '').replace(/`/g, '').trim());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
