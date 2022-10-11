// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { withMiddleware } from '../../lib/middleware'

export default withMiddleware(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    domain: {
      apis: { Onboarding }
    }
  } = req

  const tally = await Onboarding.colorTally()
  res.json(tally)
})
