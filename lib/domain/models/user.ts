import z from 'zod'

import { docSchema, idSchema } from './doc'

export const userSchema = docSchema
  .extend({
    email: z.string().email(),
    /**
     * The user that created this user.
     * Could be reflexive, in that a user may create themself
     * or could refer to an admin user
     */
    createdBy: idSchema,
    updatedBy: idSchema,
    type: z.literal('user')
  })
  .strip()

export type User = z.infer<typeof userSchema>

export const newUserSchema = userSchema.pick({ email: true })
export type NewUser = z.infer<typeof newUserSchema>

export const actorSchema = z.object({
  _id: idSchema,
  // Derived from claims on access token passed to route, extracted by route handling ie. middleware
  isAdmin: z.boolean().default(false)
})
export type Actor = z.infer<typeof actorSchema>