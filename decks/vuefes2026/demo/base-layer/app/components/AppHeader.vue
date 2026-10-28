<script setup lang="ts">
const siteName = useRuntimeConfig().public.siteName
</script>

<template>
  <header class="header">
    <span class="title">{{ siteName }}</span>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/profile">Profile</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #66800b;
  color: #fffcf0;
}
.title {
  font-size: 24px;
  font-weight: bold;
}
nav {
  display: flex;
  gap: 24px;
  font-size: 18px;
}
nav a {
  color: #fffcf0;
}
</style>
