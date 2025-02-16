<template>
  <div class="wrapper">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 100dvh;
  background: var(--surface-ground);
  padding: 2rem;
  font-family: var(--font-family);
  max-width: 40rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 768px) {
  .wrapper {
    padding: 1.5rem;
  }
}

@media screen and (max-width: 576px) {
  .wrapper {
    padding: 1rem;
  }
}
</style>
