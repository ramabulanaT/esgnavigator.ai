import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Your template logic here
  res.status(200).json({
    message: "ISO 50001 template endpoint"
  });
}
