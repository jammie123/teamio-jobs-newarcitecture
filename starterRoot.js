import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const nested = path.resolve(here, 'teamio-prototype-starter')
const sibling = path.resolve(here, '../teamio-prototype-starter')

/** Nested clone (Netlify) wins; otherwise the local sibling catalog. */
export const starterRoot = fs.existsSync(path.join(nested, 'src')) ? nested : sibling
