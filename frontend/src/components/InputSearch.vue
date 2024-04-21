<template>
    <form @submit.prevent="search" class="d-flex align-items-center mt-0">
        <input  v-model="searchText" class="form-control mr-sm-2" type="search" placeholder="Tìm kiếm" aria-label="Search">
        <button @click="search" class="btn btn-outline-primary w-50" type="button">Find</button>
    </form>
</template>

<script>
    export default {
        name: 'InputSearch',
        data() {
            return {
                searchText: '',
            }
        },
        emits: ['search'],
        methods: {
            search() {
                this.$emit("search",this.searchText);
            }
        }
    }
</script>

<style>

</style>