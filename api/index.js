   import { VercelRequest, VercelResponse } from '@vercel/node';
   import { Whisk } from '../dist/index.js';

   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') return res.status(405).end('POST only');
     const { action, prompt, mediaId } = (req.body as any);
     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE env faltando' });

     const whisk = new Whisk();
     whisk.setCookie(process.env.COOKIE);

     try {
       if (action === 'generate') {
         const media = await whisk.textToImage(prompt, { aspectRatio: 'LANDSCAPE' });
         return res.json({ id: media.id, url: media.url });
       } else if (action === 'refine' && mediaId) {
         const refined = await whisk.refineImage(mediaId, prompt);
         return res.json({ id: refined.id });
       }
       res.status(400).json({ error: 'action: generate/refine' });
     } catch (e: any) {
       res.status(500).json({ error: e.message });
     }
   }
