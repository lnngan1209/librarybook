<template>
    <div>
      <h2>Borrowing List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reader</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in BorrowList" :key="borrow._id">
            <td>{{ borrow.book_id }}</td>
            <td>{{ borrow.reader_id }}</td>
            <td>{{ borrow.borrow_date }}</td>
            <td>{{ borrow.due_date }}</td>
            <td>{{ borrow.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import BorrowService from "@/services/Borrow.service";
  import BookService from "@/services/Book.service";
  import ReaderService from "@/services/Reader.service";
  
  export default {
    data() {
      return {
        BorrowList: []
      };
    },
    async created() {
      await this.fetchBookList();
    },
    methods: {
      async fetchBookList() {
        try {
          this.BorrowList = await BorrowService.getAll();
          await Promise.all(this.BorrowList.map(async (element) => {
            const book = await BookService.get(element.book_id);
            element.book_id = book.name;
            const reader = await ReaderService.get(element.reader_id);
            element.reader_id = reader.name;
          }));
        } catch (error) {
          console.error("Error fetching borrowing list:", error);
        }
      }
    }
  };
</script>
  
<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  th {
    background-color: #aaa; /* Màu nền đen cho tiêu đề */
    color: #333;            /* Màu chữ xám lợt cho tiêu đề */
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;     /* Căn giữa ngang */
    vertical-align: middle; /* Căn giữa dọc */
}

td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;     /* Căn giữa ngang */
    vertical-align: middle; /* Căn giữa dọc */
}
  h2 {
    text-align: center;
    color: purple;
    font-size: 35px;
  }
</style>