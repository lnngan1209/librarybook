<template>
    <div>
      <h2>Book List</h2>
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
            <th>Price ($)</th>
            <th>Quantity</th>
            <th>Publication_year</th>
            <th>Publisher</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="onCreate">
              <td><input type="text" v-model="newBook.name"></td>
              <td><input type="text" v-model="newBook.price"></td>
              <td><input type="text" v-model="newBook.quantity"></td>
              <td><input type="text" v-model="newBook.publication_year"></td>
              <td>
                <select v-model="newBook.publisher_id">
                    <option disabled value="">Select publisher</option>
                    <option v-for="publisher in publisherList" :key="publisher._id" :value="publisher._id">{{ publisher.name }}</option>
                </select>
            </td>              
          <td>
            <button @click="createBook()"><i class="fa-solid fa-save" 
              :disabled="!(newBook.name && newBook.price && newBook.quantity && newBook.publisher)"></i></button>
          </td>
          </tr>
          <tr v-for="book in filteredList" :key="book._id">
            <td>
            <div v-if="book._id != onchangeItem">{{ book.name }}</div>
            <input v-if="book._id == onchangeItem" type="text" :placeholder="book.name" v-model="changevalue.name">
          </td>
          <td>
            <div v-if="book._id != onchangeItem">{{ book.price }}</div>
            <input v-if="book._id == onchangeItem" type="text" :placeholder="book.price" v-model="changevalue.price">
          </td>
          <td>
            <div v-if="book._id != onchangeItem">{{ book.quantity }}</div>
            <input v-if="book._id == onchangeItem" type="text" :placeholder="book.quantity" v-model="changevalue.quantity">
          </td>
          <td>
            <div v-if="book._id != onchangeItem">{{ book.publication_year }}</div>
            <input v-if="book._id == onchangeItem" type="text" :placeholder="book.publication_year" v-model="changevalue.publication_year">
          </td>
          <td>
            <div v-if="book._id != onchangeItem">{{ book.publisher_id }}</div>
            <select v-if="book._id == onchangeItem" v-model="changevalue.publisher_id">
              <option v-for="publisher in publisherList" :key="publisher._id" :value="publisher._id">{{ publisher.name }}</option>
            </select>
          </td>
          <td>
            <button @click="onchange(book._id)"><i class="fa-solid fa-pen"></i></button>           
            <button v-if="book._id == onchangeItem" @click="savechange(book._id, book.name, book.price, book.quantity, book.publication_year, book.publisher)"><i class="fa-solid fa-save"></i></button>
            <button v-if="book._id == onchangeItem" @click="deleteItem(book._id)" :disabled="!selectedItem"><i class="fa-solid fa-trash-alt"></i></button>
          </td>
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
        bookList: [],
        publisherList: [],
        filteredList: [],
        selectedItem: null,
        onchangeItem: '',
        showFilter: false,
        isFiltered: false,
        filterCriteria: {
          name: "",
        },
        newBook: {
          name: '',
          price: '',
          quantity: '',
          publication_year: '',
          publisher_id: ''
        },
        changevalue: {
          name: '',
          price: '',
          quantity: '',
          publication_year: '',
          publisher_id: ''
        },
      onCreate: false
      };
    },
    async created() {
      await this.fetchBookList();
      await this.fetchPublisherList();
    },
    computed: {
    filteredList() {
      this.isFiltered = this.filterCriteria.name !== "";
      const returnList = this.bookList.filter(book => 
        book.name.toLowerCase().includes(this.filterCriteria.name.toLowerCase())
      );
      return returnList;
    }
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
      },
      async fetchPublisherList() {
        try {
          this.publisherList = await PublisherService.getAll();
        } catch (error) {
          console.error("Error fetching publisher list", error);
        }
},
      toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    unFilter() {
      this.filterCriteria.name = "";
    },
    async deleteItem(book_id) {
      try {
        if (confirm("Do you want to delete this book?")) {
          await BookService.delete(book_id);
          await this.fetchBookList();
          this.$message.success('book deleted successfully!');
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        this.$message.error('Failed to delete book.');
      }
    },
    onchange(book_id) {
      this.selectedItem = this.bookList.find(book => book._id === book_id);
      if(this.onchangeItem == book_id){
        this.onchangeItem='';
      }
      else {
        this.onchangeItem=book_id;
        this.fetchPublisherList();
      }
      this.changevalue = {
        name: "",
        price: "",
        quantity: "",
        publication_year: "",
        publisher_id: ""
      };
    },
    async savechange(oldname, oldprice, oldquantity, oldpublication_year, oldpublisher_id) {
  const data = {};

  if (this.changevalue['name'] !== "" && this.changevalue['name'] !== oldname) data['name'] = this.changevalue['name'];
  if (this.changevalue['price'] !== "" && this.changevalue['price'] !== oldprice) data['price'] = this.changevalue['price'];
  if (this.changevalue['quantity'] !== "" && this.changevalue['quantity'] !== oldquantity) data['quantity'] = this.changevalue['quantity'];
  if (this.changevalue['publication_year'] !== "" && this.changevalue['publication_year'] !== oldpublication_year) data['publication_year'] = this.changevalue['publication_year'];
  if (this.changevalue['publisher_id'] !== "" && this.changevalue['publisher_id'] !== oldpublisher_id) data['publisher_id'] = this.changevalue['publisher_id'];

  try {
    await BookService.update(this.onchangeItem, data);


    
    // Cập nhật lại thông tin sách trong bookList
    const updatedBookIndex = this.bookList.findIndex(book => book._id === this.onchangeItem);
    
    if (updatedBookIndex !== -1) {
      Object.assign(this.bookList[updatedBookIndex], data);
    }
    this.fetchBookList();
    this.$message.success('Book updated successfully!');
  } catch (error) {
    console.error("Failed to update book", error);
    this.$message.error('Failed to update book.');
  } finally {
    // Reset các giá trị sau khi đã hoàn thành cập nhật và xử lý lỗi
    this.onchangeItem = '';
    this.changevalue = {
      name: '',
      price: '',
      quantity: '',
      publication_year: '',
      publisher_id: ''
    };
  }
},
        onCreateChange() {
          if (this.onCreate) {
            this.newBook = {
              name: "",
              price: "",
              quantity: "",
              publication_year: "",
              publisher_id: ""
            };
          }
          this.onCreate = !this.onCreate;
          this.fetchPublisherList();
        },
    async createBook() {
      try {
        if (!this.newBook['name'] =='' || this.newBook['price']=='' || this.newBook['quantity']=='' || this.newBook['publication_year'] =='' || this.newBook['publisher_id']=='' ) {
          await BookService.create(this.newBook);
          await this.fetchBookList();
          
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

button:hover {
  background-color: #0056b3;
}

</style>