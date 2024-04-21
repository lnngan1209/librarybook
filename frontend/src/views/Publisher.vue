<template>
    <div>
      <h2>Publisher List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in publisherList" :key="publisher._id">
            <td>{{ publisher.name }}</td>
            <td>{{ publisher.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import PublisherService from "@/services/Publisher.service";
  
  export default {
    data() {
      return {
        publisherList: []
      };
    },
    async created() {
      await this.fetchPublisherList();
    },
    methods: {
      async fetchPublisherList() {
        try {
          this.publisherList = await PublisherService.getAll();
        } catch (error) {
          console.error("Error fetching publisher list", error);
        }
      }
    }
  };
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
</style>