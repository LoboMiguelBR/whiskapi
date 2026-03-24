import { VercelRequest, VercelResponse } from '@vercel/node';
import { Whisk, Project } from '@rohitaryal/whisk-api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.COOKIE) return res.status(500).json({ error: 'Defina COOKIE no Vercel env' });

  Whisk.setCookie(process.env.COOKIE!);  // Seu cookie aqui via env

  const { action, prompt, mediaId, file, category = 'SUBJECT' } = req.body;  // Multipart para imagens depois

  try {
    if (action === 'project') {
      const project = await Project.create({ name: prompt || 'Meu Projeto Whisk' });
      return res.json({ projectId: project.id });
    }

    if (action === 'generate') {
      const media = await Whisk.textToImage(prompt, { aspectRatio: 'LANDSCAPE' });
      return res.json({ mediaId: media.id, url: media.url });
    }

    if (action === 'refine' && mediaId) {
      const refined = await Whisk.refineImage(mediaId, prompt);
      return res.json({ refinedId: refined.id });
    }

    if (action === 'upload' && file) {
      // Para imagens anexadas: no Vercel, use multer ou base64; teste local primeiro
      // Exemplo: const buffer = Buffer.from(file, 'base64');
      const uploaded = await Whisk.uploadImage(file, category);  // file como Buffer/URL
      return res.json({ refId: uploaded.id });
    }

    res.status(400).json({ error: 'Use action: project/generate/refine/upload' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
