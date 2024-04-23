<template> 
<AppHeader/>
  <div id="app">
    
    <div class="container-fluid mt-3">
      <RouterView />   
    </div>
  </div>
<AppFooter/>
</template>

<script>
import AppHeader from '../src/components/AppHeader.vue';
import AppFooter from '../src/components/AppFooter.vue';
export default {
  components: {
    AppHeader,
    AppFooter,
  },
} 
</script>

<style>
div {
  margin-bottom: 60px; /* Khoảng cách tương ứng với chiều cao của footer */
}
</style>