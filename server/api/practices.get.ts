import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'public', 'data', 'practices.json')
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw)
})
