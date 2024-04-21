<template>
    <div>
      <h2>Reader List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th>Genger</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in readerList" :key="reader._id">
            <td>{{ reader.name }}</td>
            <td>{{ reader.birthday }}</td>
            <td>{{ reader.gender }}</td>
            <td>{{ reader.address }}</td>
            <td>{{ reader.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import ReaderService from "@/services/Reader.service";
  
  export default {
    data() {
      return {
        readerList: []
      };
    },
    async created() {
      await this.fetchReaderList();
    },
    methods: {
      async fetchReaderList() {
        try {
          this.readerList = await ReaderService.getAll();
        } catch (error) {
          console.error("Error fetching reader list:", error);
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