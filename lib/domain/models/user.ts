import z from 'zod'

import { docSchema } from './doc'

export const colorSchema = z.enum(['red', 'blue', 'yellow'])
export type Color = z.infer<typeof colorSchema>

export const userDocSchema = docSchema
  .extend({
    email: z.string().email(),
    name: z.string().min(1),
    avatarUrl: z.string().url(),
    favoriteColor: colorSchema,
    type: z.literal('user')
  })
  .strip()

export type UserDoc = z.infer<typeof userDocSchema>

/**
 * Allow the domain model and doc model to diverge over time,
 * but they may start as the same shape
 */
export const userSchema = userDocSchema
export type User = z.infer<typeof userSchema>
