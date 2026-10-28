---
theme: default
title: 結局Nuxt Layersって何ができて何が嬉しいの？
info: Vue Fes Japan 2026 LT
layout: cover
colorSchema: light
fonts:
  sans: Noto Sans JP
drawings:
  persist: false
transition: slide-left
mdc: true
routerMode: hash
---

# 結局Nuxt Layersって<br>何ができて何が嬉しいの？

ryuhei373 / 株式会社ノーススター

Vue Fes Japan 2026

<!--
今日はNuxt Layers、つまりNuxtに標準搭載されているLayersという機能の話をします。よろしくお願いします。
-->

---
layout: center
---

# Nuxt Layers、知ってますか？

<!--
まずLayersという機能はご存じですか。（皆に聞く）

少し前の(辻さんの)セッションでも言及がありましたね。

- 知ってる人が多そうな場合
  - 皆さん凄いですね。私は知らなかったのですが、
- 知ってる人が少なそうな場合
  - 概ね、知らない方が多数派のようですね。私も知らなかったのですが、

Nuxt好きとしてはNuxtの中によくわからない機能が存在している、というのは悔しいので、機能自体の解釈と、こんな便利な使い方があるんじゃないか、ということを自分なりにまとめてみました。
-->

---

# 透明な型紙の例え

<div class="text-lg leading-relaxed">
<div>Nuxtアプリ（本体） → この型紙の枠にファイルを置くと、Nuxtが走査して組み立てる</div>
<div v-click="1">Layer → 同じ型紙のファイル群。単体で起動して画面にならないものでも良い。（今回、破片と呼ぶ）</div>
<div v-click="2">重ねると、上に無いものだけが下から透けて見える<span class="muted text-base ml-3">nuxt.config は隠れず、両方の中身がマージされる</span></div>
</div>

<div class="mt-8">
  <Papers
    :step="$clicks"
    :top="{ components: ['AppFooter\''], pages: ['index'], layouts: [], config: true }"
    :bottom="{ components: ['AppHeader', 'AppFooter'], pages: ['profile'], layouts: ['default'], config: true }"
  />
</div>

<div v-click="2" class="callout mt-6 text-lg">「Layer」という名前からは上に重なっていく印象を受けるが、本体の<b>下に敷いていく</b>イメージを持つとわかりやすい。本体はいつも一番上</div>

<!--
Nuxtアプリケーションは、components、pages、layoutsといった決まった名前の枠にファイルを置くと、Nuxtが枠を走査して組み立ててくれる仕組みでできています。

この「決まった名前の枠」が並んだものが「規約」ということになりますが、今回はこれを「透明な型紙」という例えで説明してみようと思います。この型紙の形をしていればNuxtアプリということですね。図の青い紙は、Layerを利用する側のアプリです。ここからは「本体」と呼びます。

[click] Layerも、同じ型紙を利用したファイル群です。app.vueやpages/index.vueが存在せず、単体で起動しても画面にならないものでも良いので「破片」と呼びます。

[click] この破片を、本体の下に敷きます。透明な紙を重ねるイメージです。重ねて上から見ると、本体に無いAppHeaderやprofile、defaultレイアウトは下から透けて見えます。AppFooterは両方にありますが、上の本体のものが見えて、Layerのものは隠れます。本体が常に一番上なので、同名は本体が勝つようになっています。

では実際に簡単なデモを見ていきましょう。
-->

---

# デモ Before

<div class="demo-lead">本体だけ。<code>/profile</code> は無い</div>

<div class="demo-grid">
<div>
  <Papers
    size="sm"
    direction="column"
    :step="0"
    :top="{ components: [], pages: ['index'], layouts: [], config: true }"
    :bottom="{}"
  />
</div>
<div class="flex flex-col gap-3">
  <img src="/demo/before-home.png" class="shot shot-main" />
  <div class="flex items-center gap-3">
    <img src="/demo/before-profile.png" class="shot shot-sub" />
    <span class="text-sm muted"><code>/profile</code> は 404</span>
  </div>
</div>
</div>

<!--
これは作ったばかりのNuxtアプリで、pages/index.vueにHelloと書いてあるだけ。ヘッダーもフッターもなく、/profileを開くと404です。

ここに破片を1枚敷きます。
-->

---

# 敷く破片: base-layer/

<div class="demo-lead">ヘッダー・フッター・layout・プロフィールページだけを持つ</div>

<div class="demo-grid">
<div>
  <Papers
    size="sm"
    direction="column"
    only="bottom"
    :top="{ components: [], pages: ['index'], layouts: [], config: true }"
    :bottom="{ components: ['AppHeader', 'AppFooter'], pages: ['profile'], layouts: ['default'], config: true }"
  />
</div>
<div class="flex flex-col gap-4">

```
base-layer/
├── app/
│   ├── components/
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   ├── layouts/
│   │   └── default.vue
│   └── pages/
│       └── profile.vue
└── nuxt.config.ts   ← siteName: 'Demo Site'
```

<div class="callout">
<code>app.vue</code> も <code>pages/index.vue</code> も無い。単体で起動しても画面にならない Nuxt アプリの破片
</div>

</div>
</div>

<!--
敷く破片はこれです。ヘッダーとフッターのコンポーネント、それらを利用するレイアウトと、先ほど404だったプロフィールページ。app.vueやpages/indexがないので単体で起動しても画面になりません。Nuxtアプリの型紙の形はしているが、枠が欠けている状態です。
-->

---

# デモ After: 破片を敷く

<div class="demo-lead flex items-center gap-3">
<span>本体の nuxt.config.ts に1行</span>

```diff
+extends: ['./base-layer'],
```

</div>

<div class="demo-grid">
<div>
  <Papers
    size="sm"
    direction="column"
    :top="{ components: [], pages: ['index'], layouts: [], config: true }"
    :bottom="{ components: ['AppHeader', 'AppFooter'], pages: ['profile'], layouts: ['default'], config: true }"
  />
</div>
<div class="flex flex-col gap-3">
  <img src="/demo/after-home.png" class="shot shot-main" />
  <div class="flex items-start gap-3">
    <img src="/demo/after-profile.png" class="shot shot-sub" />
    <div class="flex flex-col gap-1 min-w-0">
      <span class="text-sm muted"><code>/profile</code> も開く</span>
      <span class="text-xs muted">ヘッダーの「Demo Site」は Layer の nuxt.config から。本体の config には書いていない</span>
      <div class="demo-note-code">

```ts
// base-layer/nuxt.config.ts
runtimeConfig: {
  public: { siteName: 'Demo Site' },
},
```

</div>
    </div>
  </div>
</div>
</div>

<!--
本体のnuxt.configにextendsを1行、レイヤーを利用するための設定を足します。

結果がこちら。ヘッダーとフッターが付いて、/profileも開くようになりました。本体にはimport文を1つも書いていません。Layerのcomponentsはauto-importされ、pagesはルートとして生えます。

ちなみにnuxt.configはマージされるので、Layer側 のruntimeConfigに記述されているサイト名がヘッダーに表示されています。
-->

---

# デモ 上書き: 本体が勝つ

<div class="demo-lead">本体に <code>components/AppFooter.vue</code> を1つ追加</div>

<div class="demo-grid">
<div>
  <Papers
    size="sm"
    direction="column"
    :top="{ components: ['AppFooter\''], pages: ['index'], layouts: [], config: true }"
    :bottom="{ components: ['AppHeader', 'AppFooter'], pages: ['profile'], layouts: ['default'], config: true }"
  />
</div>
<div class="flex flex-col gap-3">
  <img src="/demo/override-home.png" class="shot shot-main" />
</div>
</div>

<!--
次に、本体側にAppFooter.vueを1つ置きます。

フッターだけが本体のものに変割りました。ベースになるものを敷いた上で、本体側でLayerを意識せずカスタマイズができます。便利ですね。
-->

---

# 何ができて、何が嬉しいか

<div class="mt-2 flex flex-col gap-0 text-lg">
<div v-click>

<b class="accent">1.</b> **Nuxt と同じ構造で機能を切り出せる**（パッケージにしなくていい）<br>
<span class="pl-7">→ 1つのアプリケーションとして成立していなくても、デザインや機能を同じ構造で共有できる</span>

</div>
<div v-click>

<b class="accent">2.</b> **置き場所を問わない**（同じリポジトリ / リモートリポジトリ / レジストリ）<br>
<span class="pl-7">→ 同リポジトリ内での切り出しから始め、完全に別リポジトリにしてしまってもいいし、もちろんレジストリに公開してもいい。利用側は extends を1行直すだけ</span>

</div>
<div v-click>

<b class="accent">3.</b> **同名のファイルは利用側が優先される**<br>
<span class="pl-7">→ Layer側の肥大化を心配せずに、利用側で好きな部分を好きなように差し替えられる。</span>

</div>
<div v-click>

<b class="accent">4.</b> **nuxt.config / app.config はマージされる**<br>
<span class="pl-7">→ 設定ごと配れる。extends1行で複数プロジェクトを共通構成にできる。</span>

</div>
</div>

<!--
ここまでのデモで見えたことを、「何ができて、何が嬉しいか」としてまとめます。

[click] 1つ目、Nuxtと同じ構造で機能を切り出せる。ライブラリ用に特別気を遣った書き方をせずとも、Nuxtアプリの書き方のままデザインや機能をそのまま共有できます。

[click] 2つ目、置き場所を問わない。同じリポジトリ内・GitHub・npmのどこからでも、extendsには1行書くだけでLayerとして利用できます。

[click] 3つ目、同名のファイルは利用側が優先される。これはLayer側に、共通化するための過剰な分岐処理など強いることなく、標準だけを持ち続けられることを意味します。

[click] 4つ目、設定も込みでLayerに同梱できるので、extends1行で共通構成から始められます。複数のプロジェクトに共通した土台となる設定を用意しておきたい場合に便利です。

最後に、具体例をいくつか紹介します。
-->

---

# 利用例 1: 機能ごと敷く

<div class="grid gap-8 mt-6" style="grid-template-columns: 3fr 2fr">
<div>

```
auth-layer/
├── app/
│   ├── middleware/
│   │   └── auth.global.ts   ← 全ページにログインガード
│   ├── pages/
│   │   └── login.vue
│   └── composables/
│       └── useAuth.ts
└── nuxt.config.ts
```

```ts
// 本体 nuxt.config.ts
extends: ['./auth-layer']
```

</div>
<div class="text-xl flex flex-col gap-4 self-center">

- middleware も pages も composable も、1つの破片にまとめて1行で付く
- extends を条件で切り替えれば、staging だけ敷く、のような付け外しもできる

</div>
</div>

<!--
1つ目はある程度まとまった機能を切り出す。

ログインガードのmiddleware、ログイン画面、認証用のcomposableをLayerに切り出すことで、「ログイン機能」を本体の関心の外に置く、もしくはいくつかプロジェクトで使い回すということができます。

extendsの定義自体を環境変数で切り替えることで、例えばstaging環境にだけ「staging環境ですよ」という表示をヘッダーに出す、といった利用も可能です。
-->

---

# 利用例 2: テーマを配布する

<div class="grid gap-8 mt-6" style="grid-template-columns: 3fr 2fr">
<div>

```
theme-layer/
├── app/
│   ├── assets/
│   │   └── theme.css        ← 配色、ダークモード
│   └── app.config.ts        ← ui.colors など
└── nuxt.config.ts           ← css の登録
```

```ts
// 本体 nuxt.config.ts
extends: ['github:ryuhei373/nuxt-layer-flexoki#v0.2.0']
```

</div>
<div class="text-xl flex flex-col gap-4 self-center">

- CSS と app.config だけ。コンポーネントは1つも無い
- 自分のブログから切り出して、別プロジェクトで使い回している

</div>
</div>

<div class="muted text-sm mt-6">
github.com/ryuhei373/nuxt-layer-flexoki
</div>

<!--
2つ目はテーマの配布。コンポーネントは一つも入っておらず、CSSとapp.configのみを定義したものを切り出しています。

この例は私が自分のサイトの配色を切り出して、個人開発している別プロジェクトで使い回しているものです。
-->

---

# 利用例 3: ドメイン単位で分割する

<div class="grid gap-8 mt-6" style="grid-template-columns: 3fr 2fr">
<div>

```
my-site/
├── nuxt.config.ts
├── core/      ← middleware / plugins / utils
├── site/      ← 横断的な assets、about ページ
├── blog/      ← blog の pages / components / content
└── shop/      ← shop の pages / components / stores
```

```ts
// nuxt.config.ts は extends だけ
extends: ['./core', './site', './blog', './shop']
```

</div>
<div class="text-xl flex flex-col gap-4 self-center">

- ファイルの種類（components / pages）ではなく、機能の領域（blog / shop）で切る
- 本体はほぼ空になり、アプリは「破片の集まり」になる

</div>
</div>

<div class="muted text-sm mt-10">
Dave Stewart, "Modular site architecture with Nuxt layers" (2024) — davestewart.co.uk/blog/nuxt-layers/
</div>

<!--
3つ目はドメイン単位で分割する。

この使い方が実はポピュラーなのかもしれませんが、Nuxtという規約の中でドメイン単位で分割しコロケーションを実現するという使い方もできます。

Dave Stewartさんの記事で「domainで整理する」として詳しく書かれていて、私もこのスライドを作っていく中で記事を発見し、あまりにも感心したのでここで共有させていただきます。

ぜひ読んでみてください。

以上です。ありがとうございました。
-->
