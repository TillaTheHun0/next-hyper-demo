// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { withMiddleware } from '../../lib/middleware'

type Data = {
  name: string
}

/**
 * Console.log to demonstrate domain is available on a route
 */
export default withMiddleware(function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.config)
  console.log(req.domain)
  res.status(200).json({ name: 'John Doe' })
})
