   import { Whisk } from '../dist/index.js';

   export default async function (req, res) {
     if (req.method !== 'POST') return res.status(405).end();
     const { action, prompt } = req.body;
     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE faltando' });
     Whisk.setCookie(process.env.COOKIE);
     try {
       if (action === 'generate') {
         const media = await Whisk.textToImage(prompt);
         res.json({ id: media.id, url: media.url });
       } else res.status(400).json({ error: 'action=generate' });
     } catch (e) { res.status(500).json({ error: e.message }); }
   }
