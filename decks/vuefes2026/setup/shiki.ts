import type { ThemeRegistration } from 'shiki'
import { defineShikiSetup } from '@slidev/types'

// Flexoki（ライト）の構文ハイライト配色を shiki のテーマとして定義する
// https://stephango.com/flexoki
const c = {
  paper: '#fffcf0',
  base50: '#f2f0e5',
  base500: '#878580',
  black: '#100f0f',
  red: '#af3029',
  orange: '#bc5215',
  yellow: '#ad8301',
  green: '#66800b',
  cyan: '#24837b',
  blue: '#205ea6',
  purple: '#5e409d',
  magenta: '#a02f6f',
}

const flexokiLight: ThemeRegistration = {
  name: 'flexoki-light',
  type: 'light',
  colors: {
    'editor.background': c.base50,
    'editor.foreground': c.black,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.base500, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'], settings: { foreground: c.green } },
    { scope: ['string', 'string.quoted', 'string.template'], settings: { foreground: c.cyan } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: c.purple } },
    { scope: ['constant', 'variable.other.constant'], settings: { foreground: c.yellow } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: c.orange } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: c.orange } },
    { scope: ['variable', 'meta.object-literal.key', 'support.type.property-name', 'entity.other.attribute-name'], settings: { foreground: c.blue } },
    { scope: ['entity.name.tag'], settings: { foreground: c.blue } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: c.base500 } },
    { scope: ['markup.inserted', 'punctuation.definition.inserted'], settings: { foreground: c.green } },
    { scope: ['markup.deleted', 'punctuation.definition.deleted'], settings: { foreground: c.red } },
    { scope: ['invalid'], settings: { foreground: c.red } },
  ],
}

export default defineShikiSetup(() => ({
  themes: {
    light: flexokiLight,
    dark: flexokiLight,
  },
}))
