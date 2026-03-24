   import { VercelRequest, VercelResponse } from '@vercel/node';
   import { Whisk } from '../src/index.js';  // Usa src (compila no build)

   export default async function handler(req, res) {
     console.log('POST /api chamado', req.body);  // Log body
     if (req.method !== 'POST') return res.status(405).end('POST only');
     const { action, prompt, mediaId } = req.body || {};
     console.log('Action:', action, 'COOKIE?', !!process.env.COOKIE ? 'OK' : 'FALTANDO');

     if (!process.env.COOKIE) return res.status(500).json({ error: 'COOKIE env faltando ou inválido' });

     try {
       const whisk = new Whisk();
       console.log('Whisk criado');
       whisk.setCookie(process.env.COOKIE);
       console.log('Cookie setado');

       if (action === 'generate') {
         const media = await whisk.textToImage(prompt || 'teste', { aspectRatio: 'LANDSCAPE' });
         console.log('Imagem gerada:', media.id);
         return res.json({ id: media.id, url: media.url });
       } else if (action === 'refine' && mediaId) {
         const refined = await whisk.refineImage(mediaId, prompt || '');
         return res.json({ id: refined.id });
       }
       return res.status(400).json({ error: 'Use action: generate/refine' });
     } catch (e) {
       console.error('Erro Whisk:', e.message || e);
       return res.status(500).json({ error: e.message || 'Falha Whisk' });
     }
   }
