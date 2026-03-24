   import pkg from '@vercel/node';
   const { VercelRequest, VercelResponse } = pkg;
   import { Whisk } from '../dist/index.js';

   export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
     const { action, prompt, mediaId } = req.body || {};
     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE env faltando' });

     try {
       const whisk = new Whisk();
       whisk.setCookie(process.env.COOKIE);

       if (action === 'generate') {
         const media = await whisk.textToImage(prompt || 'gato azul', { aspectRatio: 'LANDSCAPE' });
         return res.json({ id: media.id, url: media.url });
       } else if (action === 'refine' && mediaId) {
         const refined = await whisk.refineImage(mediaId, prompt || '');
         return res.json({ id: refined.id });
       }
       return res.status(400).json({ error: 'action: generate/refine' });
     } catch (e) {
       return res.status(500).json({ error: e.message });
     }
   }
