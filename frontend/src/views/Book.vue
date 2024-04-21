<template>
    <div>
      <h2>Book List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Publication_year</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in bookList" :key="book._id">
            <td>{{ book.name }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.quantity }}</td>
            <td>{{ book.publication_year }}</td>
            <td>{{ book.publisher_id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import BookService from "@/services/Book.service";
  import PublisherService from "@/services/Publisher.service";
  
  export default {
    data() {
      return {
        bookList: []
      };
    },
    async created() {
      await this.fetchBookList();
    },
    methods: {
      async fetchBookList() {
        try {
          this.bookList = await BookService.getAll();
          await Promise.all(this.bookList.map(async (element) => {
            const Publisher = await PublisherService.get(element.publisher_id);
            element.publisher_id = Publisher.name;
          }));
        } catch (error) {
          console.error("Error fetching book list", error);
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