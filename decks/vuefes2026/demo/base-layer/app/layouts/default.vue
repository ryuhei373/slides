<template>
  <div class="layout">
    <AppHeader />
    <div class="content">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
</style>
