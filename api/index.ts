   import { Whisk } from '../dist/index.js';

   export default async function (req, res) {
     if (req.method !== 'POST') return res.status(405).end('POST only');
     const { action, prompt, mediaId } = req.body;
     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE env faltando' });
     Whisk.setCookie(process.env.COOKIE);
     try {
       if (action === 'generate') {
         const media = await Whisk.textToImage(prompt, { aspectRatio: 'LANDSCAPE' });
         res.json({ id: media.id, url: media.url });
       } else if (action === 'refine' && mediaId) {
         const refined = await Whisk.refineImage(mediaId, prompt);
         res.json({ id: refined.id });
       } else {
         res.status(400).json({ error: 'action: generate/refine' });
       }
     } catch (e) {
       res.status(500).json({ error: e.message });
     }
   }
