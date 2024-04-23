<template>
    <div>
      <h2>Borrowing List</h2>
      <div class="actions">
        <div class="search-container">
          <h3>Search:</h3>
          <input type="text" v-model="filterCriteria.name" placeholder="Name">
          <button v-if="isFiltered" @click="unFilter" class="clear-filter-button">Clear filter</button>        
        </div>
        <div class="action-container">
          <button @click="onCreateChange" class="add-button">{{ onCreate ? 'Cancel' : 'Add' }}</button>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reader</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="onCreate">
            <td>
                <select v-model="newBorrow.book_id">
                    <option disabled value="">Select book</option>
                    <option v-for="book in bookList" :key="book._id" :value="book._id">{{ book.name }}</option>
                </select>
            </td> 
            <td>
                <select v-model="newBorrow.reader_id">
                    <option disabled value="">Select reader</option>
                    <option v-for="reader in readerList" :key="reader._id" :value="reader._id">{{ reader.name }}</option>
                </select>
            </td> 
              <td><input type="text" v-model="newBorrow.borrow_date"></td>
              <td><input type="text" v-model="newBorrow.due_date"></td>
              <td><input type="text" v-model="newBorrow.status"></td>
                           
          <td>
            <button @click="createBorrow()"><i class="fa-solid fa-save" 
              :disabled="!(newBorrow.name && newBorrow.reader && newBorrow.borrow_date && newBorrow.due_date && newBorrow.status)"></i></button>
          </td>
          </tr>
          <tr v-for="borrow in filteredList" :key="borrow._id">
            <td>
              <select v-if="borrow._id == onchangeItem" v-model="changevalue.book_id">
                <option disabled value="">Select book</option>
                <option v-for="book in bookList" :key="book._id" :value="book._id">{{ book.name }}</option>
              </select>
              <div v-if="borrow._id != onchangeItem">{{ borrow.book_id }}</div>
            </td>
            <td>
              <select v-if="borrow._id == onchangeItem" v-model="changevalue.reader_id">
                <option disabled value="">Select reader</option>
                <option v-for="reader in readerList" :key="reader._id" :value="reader._id">{{ reader.name }}</option>
              </select>
              <div v-if="borrow._id != onchangeItem">{{ borrow.reader_id }}</div>
            </td>
          <td>
            <div v-if="borrow._id != onchangeItem">{{ borrow.borrow_date }}</div>
            <input v-if="borrow._id == onchangeItem" type="text" :placeholder="borrow.borrow_date" v-model="changevalue.borrow_date">
          </td>
          <td>
            <div v-if="borrow._id != onchangeItem">{{ borrow.due_date }}</div>
            <input v-if="borrow._id == onchangeItem" type="text" :placeholder="borrow.due_date" v-model="changevalue.due_date">
          </td>
          <td>
            <div v-if="borrow._id != onchangeItem">{{ borrow.status }}</div>
            <input v-if="borrow._id == onchangeItem" type="text" :placeholder="borrow.status" v-model="changevalue.status">
          </td>
          <td>
            <button @click="onchange(borrow._id)"><i class="fa-solid fa-pen"></i></button>
            <button v-if="borrow._id == onchangeItem" @click="savechange(borrow._id, borrow.book_id, borrow.reader_id, borrow.borrow_date, borrow.due_date, borrow.status)"><i class="fa-solid fa-save"></i></button>
            <button v-if="borrow._id == onchangeItem" @click="deleteItem(borrow._id)" :disabled="!selectedItem"><i class="fa-solid fa-trash-alt"></i></button>
          </td>
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
        borrowList: [],
        bookList: [],
        readerList: [],
        onchangeItem: '',
        filteredList: [],
        selectedItem: null,
        showFilter: false,
        isFiltered: false,
        filterCriteria: {
          name: "",
        },
        changevalue: {
          book_id: '',
          reader_id: '',
          borrow_date: '',
          due_date: '',
          status: ''
        },
        newBorrow: {
          book_id: '',
          reader_id: '',
          borrow_date: '',
          due_date: '',
          status: ''
        },
        onCreate: false
      };
    },
    async created() {
      await this.fetchBorrowList();
      await this.fetchBookList();
      await this.fetchReaderList();
    },
    computed: {
      filteredList() {
        this.isFiltered = this.filterCriteria.name !== "";
        const returnList = this.borrowList.filter(borrow => 
          borrow.book_id.toLowerCase().includes(this.filterCriteria.name.toLowerCase()) || 
          borrow.reader_id.toLowerCase().includes(this.filterCriteria.name.toLowerCase())
        );
        return returnList;
      }
    },
    methods: {
      async fetchBorrowList() {
        try {
          this.borrowList = await BorrowService.getAll();
          await Promise.all(this.borrowList.map(async (element) => {
            const book = await BookService.get(element.book_id);
            element.book_id = book.name;
            const reader = await ReaderService.get(element.reader_id);
            element.reader_id = reader.name;
          }));
        } catch (error) {
          console.error("Error fetching borrowing list:", error);
        }
      },
      toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    unFilter() {
      this.filterCriteria.name = "";
    },
    async deleteItem(borrow_id) {
      try {
        if (confirm("Do you want to delete this borrowing?")) {
          await BorrowService.delete(borrow_id);
          await this.fetchBorrowList();
          this.$message.success('borrowing deleted successfully!');
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        this.$message.error('Failed to delete book.');
      }
    },
      onchange(borrow_id) {
        this.selectedItem = this.borrowList.find(borrow => borrow._id === borrow_id);
      if(this.onchangeItem == borrow_id){
        this.onchangeItem='';
      }
      else {
        this.onchangeItem=borrow_id;
        this.fetchPublisherList();
      }
        this.changevalue = {
          book_id: "",
          reader_id: "",
          borrow_date: "",
          due_date: "",
          status: ""
        };
      },
      async savechange(borrow_id, oldbook_id, oldreader_id, oldborrow_date, olddue_date, oldstatus) {
  const updatedData = {};

  if (this.changevalue['book_id'] !== "" && this.changevalue['book_id'] !== oldbook_id) updatedData['book_id'] = this.changevalue['book_id'];
  if (this.changevalue['reader_id'] !== "" && this.changevalue['reader_id'] !== oldreader_id) updatedData['reader_id'] = this.changevalue['reader_id'];
  if (this.changevalue['borrow_date'] !== "" && this.changevalue['borrow_date'] !== oldborrow_date) updatedData['borrow_date'] = this.changevalue['borrow_date'];
  if (this.changevalue['due_date'] !== "" && this.changevalue['due_date'] !== olddue_date) updatedData['due_date'] = this.changevalue['due_date'];
  if (this.changevalue['status'] !== "" && this.changevalue['status'] !== oldstatus) updatedData['status'] = this.changevalue['status'];

  try {
    await BorrowService.update(borrow_id, updatedData);
    
    // Update borrowList with the updated data
    const updatedBorrowIndex = this.borrowList.findIndex(borrow => borrow._id === borrow_id);
    if (updatedBorrowIndex !== -1) {
      Object.assign(this.borrowList[updatedBorrowIndex], updatedData);
    }

    this.fetchBorrowList();
    this.$message.success('Borrow updated successfully!');
  } catch (error) {
    console.error("Failed to update borrow", error);
    this.$message.error('Failed to update borrow.');
  } finally {
    this.onchangeItem = '';
    this.changevalue = {
      book_id: '',
      reader_id: '',
      borrow_date: '',
      due_date: '',
      status: ''
    };
  }
},
      onCreateChange() {
          if (this.onCreate) {
            this.newBorrow = {
              book_id: '',
            reader_id: '',
            borrow_date: '',
            due_date: '',
            status: ''
            };
          }
          this.onCreate = !this.onCreate;
          this.fetchBookList();
          this.fetchReaderList();
        },
        async createBorrow() {
        try {
          if (!this.newBorrow['book_id'] || !this.newBorrow['reader_id'] || !this.newBorrow['borrow_date'] || !this.newBorrow['due_date'] || !this.newBorrow['status']) {
            await BorrowService.create(this.newBorrow);
            await this.fetchBorrowList();
          }
          this.onCreateChange();
        } catch (error) {
          console.log('Error when adding item', error);
        }
      }
    }
  };
</script>
  
<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  
  th {
    background-color: #aaa; /* Màu nền đen cho tiêu đề */
    color: #333;  
    padding: 15px;          /* Màu chữ xám lợt cho tiêu đề */

  }

  td {
    border: 1px solid #ddd;
    text-align: center;
  }
  h2 {
    text-align: center;
    color: purple;
    font-size: 35px;
  }
  .search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* Để tạo khoảng cách giữa thanh tìm kiếm và các nút */
}

.search-container h3 {
  margin-right: 10px; /* Để tạo khoảng cách giữa chữ "Search:" và ô input */
  font-size: 18px; /* Điều chỉnh kích thước font cho chữ "Search:" */
  color: #333; /* Màu chữ */
}

.search-container input[type="text"] {
  padding: 10px; /* Padding cho ô input */
  font-size: 18px; /* Kích thước font cho ô input */
  border: 1px solid #ccc; /* Đường viền cho ô input */
  border-radius: 4px; /* Bo tròn các góc của ô input */
}

.clear-filter-button {
  margin-left: 10px; /* Khoảng cách giữa ô input và nút "Clear filter" */
  padding: 10px 15px; /* Điều chỉnh kích thước nút */
  font-size: 16px;
  background-color: #f44336; /* Màu đỏ cho nút */
  color: white; /* Màu chữ trắng */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s; /* Hiệu ứng khi hover */
}


.add-button {
  padding: 10px 20px; /* Điều chỉnh kích thước nút */
  font-size: 16px;
  background-color: #4CAF50; /* Màu xanh lá cây cho nút "Add" */
  color: white; /* Màu chữ trắng */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s; /* Hiệu ứng khi hover */
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Header */

/* Rows */


tbody tr:hover {
  background-color: #f5f5f5;
}


/* Inputs */
input[type="text"] {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Buttons */
button {
  padding: 8px 8px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px; /* Thêm margin vào đây */
}

/* FontAwesome Icons */
button i {
  margin-right: 5px;
}



</style>