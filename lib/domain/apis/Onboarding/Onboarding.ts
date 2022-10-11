import { groupBy, pipe, prop } from 'ramda'
import z from 'zod'

import { addType, create, typeSchema } from '../../models/doc'
import { GenericError } from '../../models/err'
import { User, userDocSchema, userSchema } from '../../models/user'
import { DomainContext } from '../../types'

const onboardUserSchema = z.object({
  data: userSchema.pick({ name: true, email: true, favoriteColor: true, avatarUrl: true })
})

export class Onboarding {
  constructor(private context: DomainContext) {}

  /**
   * Every api has an input schema, for compile time validation and runtime validation
   * via zod
   */
  async addUser(input: z.infer<typeof onboardUserSchema>): Promise<User> {
    const {
      clients: { hyper }
    } = this.context

    const { data } = onboardUserSchema.parse(input)

    // use our domain models to parse a document
    const doc = pipe(
      addType('user'),
      // Map service model to persistence model
      create(userDocSchema)
    )(data)

    await Promise.all([])

    // Map persistence model to service model
    return userSchema.parse(doc)
  }

  async getUsers(): Promise<User[]> {
    const {
      clients: { hyper }
    } = this.context

    const res = { ok: true, msg: '', docs: [] }

    if (!res.ok) throw new GenericError(res.msg)

    return res.docs.map((d) => userSchema.parse(d))
  }

  async colorTally() {
    const {
      clients: { hyper }
    } = this.context

    // MISS - Calculate and cache
    console.log('MISS - Calculating color tally...')

    const users = await this.getUsers()

    const groups = groupBy(prop('favoriteColor'), users)
    const computed = Object.keys(groups).reduce(
      (acc, color) => ({ ...acc, [color]: groups[color as keyof typeof groups].length }),
      {}
    )

    return computed
  }
}
