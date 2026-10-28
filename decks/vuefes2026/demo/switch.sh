#!/bin/sh
# デモの状態を切り替える: before | after | override
#   before   : extends なし（Layer を敷かない）
#   after    : extends: ['./base-layer'] で Layer を敷く
#   override : after ＋ 本体に app/components/AppFooter.vue を置いて Layer 版を上書き
set -eu
cd "$(dirname "$0")"

write_config() {
  if [ "$1" = "with-extends" ]; then
    cat > nuxt.config.ts <<'CONF'
export default defineNuxtConfig({
  extends: ['./base-layer'],
})
CONF
  else
    cat > nuxt.config.ts <<'CONF'
export default defineNuxtConfig({
})
CONF
  fi
}

write_footer() {
  mkdir -p app/components
  cat > app/components/AppFooter.vue <<'VUE'
<template>
  <footer class="footer">© My Footer — overridden by app</footer>
</template>

<style scoped>
.footer {
  padding: 20px 32px;
  background: #205ea6;
  color: #fffcf0;
  font-size: 18px;
}
</style>
VUE
}

remove_footer() {
  rm -f app/components/AppFooter.vue
  rmdir app/components 2>/dev/null || true
}

case "${1:-}" in
  before)
    write_config without-extends
    remove_footer
    ;;
  after)
    write_config with-extends
    remove_footer
    ;;
  override)
    write_config with-extends
    write_footer
    ;;
  *)
    echo "usage: $0 before|after|override" >&2
    exit 1
    ;;
esac

echo "switched to: $1"
