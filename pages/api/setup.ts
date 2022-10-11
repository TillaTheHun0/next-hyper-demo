// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { faker } from '@faker-js/faker'
import { pipe, range } from 'ramda'

import { colorSchema, userDocSchema } from '../../lib/domain/models/user'
import { withMiddleware } from '../../lib/middleware'
import { create } from '../../lib/domain/models/doc'

export default withMiddleware(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    domain: {
      clients: { hyper }
    }
  } = req

  const seedUsers = range(0, 5).map(() =>
    pipe(create(userDocSchema))({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
      favoriteColor: faker.helpers.arrayElement(Object.values(colorSchema.Enum)),
      type: 'user'
    })
  )

  console.log(await hyper.data.bulk(seedUsers))

  res.send('OK')
})
