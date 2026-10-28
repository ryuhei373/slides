<script setup lang="ts">
import { computed } from 'vue'

// Nuxt アプリの「型紙」を重ねる図。
// 各紙は規約ディレクトリの欄を持ち、欄の中にファイル名のスロットが並ぶ。
// 名前末尾の ' は「同名ファイルの別バージョン」を表し、同じ欄の同じ位置に重なる
interface Sheet {
  components?: string[]
  pages?: string[]
  layouts?: string[]
  config?: boolean
}

const props = withDefaults(defineProps<{
  top: Sheet
  bottom: Sheet
  // 0: 上の紙だけ / 1: 下の紙を横に並べる（重ねない） / 2: 下に敷いて合成結果まで
  step?: number
  topLabel?: string
  bottomLabel?: string
  size?: 'md' | 'sm'
  // row: 重ねた紙 → 見えるもの を横に / column: 縦に積む
  direction?: 'row' | 'column'
  // bottom: Layer の紙だけを単独で見せる（本体・合成結果は出さない）。top は欄の並びを本体と揃えるためだけに使う
  only?: 'bottom'
}>(), {
  step: 2,
  topLabel: '本体',
  bottomLabel: 'Layer',
  size: 'md',
  direction: 'row',
})

// 手前に描く紙。only="bottom" のときは Layer の紙を本体の紙の位置に置く
const soloBottom = computed(() => props.only === 'bottom')
const front = computed(() => (soloBottom.value ? props.bottom : props.top))
const frontFrom = computed(() => (soloBottom.value ? 'bottom' : 'top') as 'top' | 'bottom')

const ROWS = [
  { key: 'components', label: 'components/' },
  { key: 'pages', label: 'pages/' },
  { key: 'layouts', label: 'layouts/' },
] as const
const SLOTS = 2

type RowKey = typeof ROWS[number]['key']
type Slot = { name: string, from: 'top' | 'bottom' } | null

const baseName = (name: string) => name.replace(/'+$/, '')

// 欄ごとのスロット位置。下の紙の並びを基準に、上の紙にしか無いものを先頭に足す
const order = computed(() => {
  const result = {} as Record<RowKey, string[]>
  for (const { key } of ROWS) {
    const bottom = (props.bottom[key] ?? []).map(baseName)
    const topOnly = (props.top[key] ?? []).map(baseName).filter(n => !bottom.includes(n))
    result[key] = [...topOnly, ...bottom]
  }
  return result
})

function slotsOf(sheet: Sheet, key: RowKey): (string | null)[] {
  const names = sheet[key] ?? []
  const slots: (string | null)[] = Array.from({ length: SLOTS }, () => null)
  order.value[key].forEach((base, i) => {
    slots[i] = names.find(n => baseName(n) === base) ?? null
  })
  return slots
}

// 末尾 ' 付きは下の紙の同名ファイルを上書きしたもの
const isOverride = (name: string) => name !== baseName(name)

function itemClass(name: string, from: 'top' | 'bottom') {
  if (from === 'top')
    return isOverride(name) ? 'override-item' : 'top-item'
  return 'bottom-item'
}

function isHidden(key: RowKey, index: number) {
  return slotsOf(props.top, key)[index] != null
}

function resultOf(key: RowKey): Slot[] {
  const top = slotsOf(props.top, key)
  const bottom = slotsOf(props.bottom, key)
  return top.map((t, i) => {
    if (t != null)
      return { name: t, from: 'top' }
    const b = bottom[i]
    return b != null ? { name: b, from: 'bottom' } : null
  })
}
</script>

<template>
  <div class="papers" :class="[size, direction]">
    <div class="stack">
      <!-- 下の紙（Layer） -->
      <div class="paper bottom" :class="{ off: step < 2 || soloBottom }">
        <span class="label">{{ bottomLabel }}</span>
        <div v-for="row in ROWS" :key="row.key" class="row">
          <span class="dir">{{ row.label }}</span>
          <div
            v-for="(name, i) in slotsOf(bottom, row.key)"
            :key="i"
            class="cell"
            :class="name == null ? 'blank' : isHidden(row.key, i) ? 'hidden' : 'bottom-item'"
          >
            {{ name ? baseName(name) : '' }}
          </div>
        </div>
        <div class="row">
          <span class="dir">nuxt.config.ts</span>
          <div class="cell config" :class="bottom.config ? 'bottom-item' : 'blank'">
            {{ bottom.config ? '✓' : '' }}
          </div>
        </div>
      </div>
      <!-- 上の紙（本体） -->
      <div class="paper top" :class="{ 'layer-solo': soloBottom }">
        <span class="label">{{ soloBottom ? bottomLabel : topLabel }}</span>
        <div v-for="row in ROWS" :key="row.key" class="row">
          <span class="dir">{{ row.label }}</span>
          <div
            v-for="(name, i) in slotsOf(front, row.key)"
            :key="i"
            class="cell"
            :class="name == null ? 'empty' : itemClass(name, frontFrom)"
          >
            {{ name ? baseName(name) : '' }}
          </div>
        </div>
        <div class="row">
          <span class="dir">nuxt.config.ts</span>
          <div class="cell config" :class="front.config ? `${frontFrom}-item` : 'empty'">
            {{ front.config ? '✓' : '' }}
          </div>
        </div>
      </div>
    </div>

    <div class="arrow" :class="{ off: step < 2 || soloBottom }">
      <span>上から見ると</span>
      <span class="mark">{{ direction === 'column' ? '↓' : '→' }}</span>
    </div>

    <!-- 右側の欄。step 1 では Layer の紙を単独で、step 2 では合成結果を同じ位置に出す -->
    <div class="right">
      <div class="paper side" :class="{ off: step !== 1 || soloBottom }">
        <span class="label">{{ bottomLabel }}</span>
        <div v-for="row in ROWS" :key="row.key" class="row">
          <span class="dir">{{ row.label }}</span>
          <div
            v-for="(name, i) in slotsOf(bottom, row.key)"
            :key="i"
            class="cell"
            :class="name == null ? 'empty' : 'bottom-item'"
          >
            {{ name ? baseName(name) : '' }}
          </div>
        </div>
        <div class="row">
          <span class="dir">nuxt.config.ts</span>
          <div class="cell config" :class="bottom.config ? 'bottom-item' : 'empty'">
            {{ bottom.config ? '✓' : '' }}
          </div>
        </div>
      </div>

      <div class="paper result" :class="{ off: step < 2 || soloBottom }">
        <span class="label">見えるもの</span>
        <div v-for="row in ROWS" :key="row.key" class="row">
          <span class="dir">{{ row.label }}</span>
          <div
            v-for="(slot, i) in resultOf(row.key)"
            :key="i"
            class="cell"
            :class="slot == null ? 'blank' : itemClass(slot.name, slot.from)"
          >
            {{ slot ? baseName(slot.name) : '' }}
          </div>
        </div>
        <div class="row">
          <span class="dir">nuxt.config.ts</span>
          <div class="cell config merged">✓ マージ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.papers {
  --dir: 118px;
  --cell: 96px;
  --cell-h: 30px;
  --gap: 6px;
  --pad: 12px;
  --shift: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  font-size: 15px;
}
.papers.sm {
  --dir: 104px;
  --cell: 84px;
  --cell-h: 24px;
  --gap: 4px;
  --pad: 8px;
  --shift: 6px;
  gap: 20px;
  font-size: 12.5px;
}
.stack {
  position: relative;
  padding: var(--shift) 0 0 var(--shift);
}
.paper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  /* 左は下の紙の輪郭が欄名に掛からないよう、ずらし幅の分だけ空ける */
  padding: calc(var(--pad) + 1.2em) var(--pad) var(--pad) calc(var(--pad) + var(--shift));
  border-radius: 8px;
  transition: opacity 0.3s;
}
.paper.bottom {
  background: var(--fx-base-50);
  border: 2px solid var(--fx-base-300);
}
.paper.top {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 94, 166, 0.06);
  border: 2px solid var(--fx-blue-600);
  box-shadow: 0 4px 12px rgba(16, 15, 15, 0.1);
}
.paper.result {
  background: var(--fx-paper);
  border: 2px solid var(--fx-black);
}
/* 合成結果と Layer 単独の紙は同じ位置に重ね、step で出し分ける */
.right {
  display: grid;
}
.right > .paper {
  grid-area: 1 / 1;
}
/* 横に並べた Layer の紙。本体の紙と上端を揃える */
.paper.side {
  background: var(--fx-base-50);
  border: 2px solid var(--fx-green-600);
  box-shadow: 0 4px 12px rgba(16, 15, 15, 0.1);
}
/* 横並びでは本体・Layer・合成結果の上端を揃え、矢印だけ中央に置く */
.papers.row {
  align-items: flex-start;
}
.papers.row .arrow {
  align-self: center;
}
.papers.row .paper.side,
.papers.row .paper.result {
  align-self: start;
}
.paper.side .label {
  color: var(--fx-green-600);
}
.paper.side .cell.empty {
  border-color: var(--fx-base-300);
}

.off {
  opacity: 0;
}
.label {
  position: absolute;
  top: 2px;
  left: var(--pad);
  font-size: 0.8em;
  font-weight: 700;
  color: var(--fx-base-600);
}
.paper.top .label {
  color: var(--fx-blue-600);
}
.paper.bottom .label {
  top: auto;
  bottom: calc(-1.6em - 2px);
}
.paper.result .label {
  color: var(--fx-black);
}
/* 下の紙は輪郭ごと中身も右下にずらし、1枚の紙が敷かれているように見せる */
.row {
  display: flex;
  align-items: center;
  gap: var(--gap);
}
.dir {
  width: var(--dir);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.9em;
  color: var(--fx-base-800);
}
/* 欄の位置は揃っているので、欄名は上の紙のものだけ見せる */
.paper.bottom .dir {
  visibility: hidden;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cell);
  height: var(--cell-h);
  border-radius: 5px;
  font-family: var(--slidev-code-font-family, monospace);
  font-weight: 600;
  font-size: 0.9em;
}
.cell.top-item {
  background: var(--fx-blue-600);
  color: var(--fx-paper);
}
.cell.override-item {
  background: var(--fx-blue-600);
  color: var(--fx-paper);
}
.cell.bottom-item {
  background: var(--fx-green-600);
  color: var(--fx-paper);
}
.paper.top.layer-solo {
  background: var(--fx-base-50);
  border-color: var(--fx-green-600);
}
.paper.top.layer-solo .label {
  color: var(--fx-green-600);
}
.paper.top.layer-solo .cell.empty {
  border-color: var(--fx-base-300);
}
/* 本体の紙越しに透けて見える Layer のファイルは薄い緑 */
.paper.bottom .cell.bottom-item {
  background: var(--fx-green-400);
}
.cell.hidden {
  background: var(--fx-base-300);
  color: var(--fx-base-500);
}
.cell.empty {
  border: 1.5px dashed var(--fx-blue-400);
}
.cell.blank {
  border: 1.5px dashed var(--fx-base-200);
}
.cell.merged {
  width: calc(var(--cell) * 2 + var(--gap));
  background: var(--fx-base-900);
  color: var(--fx-paper);
}
.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  font-size: 0.85em;
  color: var(--fx-base-600);
  transition: opacity 0.3s;
}
.arrow .mark {
  font-size: 2.2em;
  line-height: 1;
}
.papers.column {
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.papers.column .stack {
  margin-bottom: 1.4em;
}
.papers.column .arrow {
  flex-direction: row;
  gap: 8px;
  padding-left: 40px;
}
.papers.column .arrow .mark {
  font-size: 1.6em;
}
</style>
