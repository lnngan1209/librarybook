<template>
    <div>
      <h2>Staff List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffList" :key="staff._id">
            <td>{{ staff.name }}</td>
            <td>{{ staff.position }}</td>
            <td>{{ staff.address }}</td>
            <td>{{ staff.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
import StaffService from "@/services/Staff.service"
  
  export default {
    data() {
      return {
        staffList: []
      };
    },
    async created() {
      await this.fetchStaffList();
    },
    methods: {
      async fetchStaffList() {
        try {
          this.staffList = await StaffService.getAll();
        } catch (error) {
          console.error("Error fetching staff list", error);
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