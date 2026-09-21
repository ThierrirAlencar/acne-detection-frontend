<script setup lang="ts">

    import Header from '@/components/permanent/header.vue';
    import Footer from '@/components/permanent/footer.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col md:ml-64">
    <Header />
    <RouterView />
    <Footer />
  </div>

</template>

