// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { faker } from '@faker-js/faker'

import { Color, colorSchema, User } from '../../lib/domain/models/user'
import { withMiddleware } from '../../lib/middleware'

export default withMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const {
    domain: {
      apis: { Onboarding }
    }
  } = req

  // stub user
  const newUser = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    avatarUrl: faker.image.avatar(),
    favoriteColor: faker.helpers.arrayElement(Object.values(colorSchema.Enum)) as Color
  }

  const user = await Onboarding.addUser({ data: newUser })
  res.json(user)
})
