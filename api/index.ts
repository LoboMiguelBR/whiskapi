   import { Whisk } from '../dist/index.js';  // Import local pós-build

   export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE env missing' });

     Whisk.setCookie(process.env.COOKIE);  // Seu cookie no env Vercel

     const { action, prompt, mediaId } = req.body;

     try {
       if (action === 'generate') {
         const media = await Whisk.textToImage(prompt, { aspectRatio: 'LANDSCAPE' });
         return res.json({ mediaId: media.id, url: media.url });
       }
       if (action === 'refine' && mediaId) {
         const refined = await Whisk.refineImage(mediaId, prompt);
         return res.json({ refinedId: refined.id });
       }
       // + outros: project, upload etc.
       res.status(400).json({ error: 'action: generate/refine' });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   }
