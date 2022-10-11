import { mergeDeepRight } from 'ramda'
import z from 'zod'

import { domainConfig } from './domain/config'

export const MODE = process.env['NODE_ENV']

if (!MODE) throw new Error('NODE_ENV must be defined')

/**
 * We extend the domainConfig, so this will contain
 * all configuration for our presentation and our domain
 */
const environmentConfig = domainConfig.extend({})

const commonConfig = environmentConfig.deepPartial().parse({
  hyper: process.env['HYPER']
})

const allConfig = {
  development: {},
  test: {},
  staging: {},
  production: {}
}

export const config = environmentConfig.parse(
  [commonConfig, allConfig[MODE]].reduce((acc, cur) => mergeDeepRight(acc, cur), {})
)
export type EnvironmentConfig = z.infer<typeof environmentConfig>

console.log(config)
