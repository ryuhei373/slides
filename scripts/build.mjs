import { execFileSync } from 'node:child_process'
import { cpSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const decks = readdirSync(join(root, 'decks'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

rmSync(dist, { recursive: true, force: true })

for (const deck of decks) {
  console.log(`\n=== Building ${deck} ===`)
  execFileSync(
    'pnpm',
    [
      '--filter', `@slides/${deck}`,
      'exec', 'slidev', 'build',
      '--base', `/${deck}/`,
      '--without-notes',
      '--out', join(dist, deck),
    ],
    { cwd: root, stdio: 'inherit' },
  )
}

cpSync(join(root, 'public'), dist, { recursive: true })
console.log(`\nBuilt ${decks.length} deck(s) into ${dist}`)
