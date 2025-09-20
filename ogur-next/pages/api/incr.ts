import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slug = (req.query.slug as string) ?? '';
    if (!slug) {
      res.status(400).json({ error: 'missing slug' });
      return;
    }
    await redis.incr(`views:${slug}`);
    res.status(204).end();
  } catch {
    // No-Redis fallback: do not fail the page just because counter is off
    res.status(200).end();
  }
}
