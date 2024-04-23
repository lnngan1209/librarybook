<template>
  <div>
    <h2>Reader List</h2>
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
          <th>Birthday</th>
          <th>Gender</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="onCreate">
          <td><input type="text" v-model="newReader.name"></td>
          <td><input type="text" v-model="newReader.birthday"></td>
          <td><input type="text" v-model="newReader.gender"></td>
          <td><input type="text" v-model="newReader.address"></td>
          <td><input type="text" v-model="newReader.phone"></td>
          <td>
            <button @click="createReader()"><i class="fa-solid fa-save" 
              :disabled="!(newReader.name && newReader.birthday && newReader.gender && newReader.address && newReader.phone)"></i></button>
          </td>
        </tr>
        <tr v-for="reader in filteredList" :key="reader._id">
          <td>
            <div v-if="reader._id != onchangeItem">{{ reader.name }}</div>
            <input v-if="reader._id == onchangeItem" type="text" :placeholder="reader.name" v-model="changevalue.name">
          </td>
          <td>
            <div v-if="reader._id != onchangeItem">{{ reader.birthday }}</div>
            <input v-if="reader._id == onchangeItem" type="text" :placeholder="reader.birthday" v-model="changevalue.birthday">
          </td>
          <td>
            <div v-if="reader._id != onchangeItem">{{ reader.gender }}</div>
            <input v-if="reader._id == onchangeItem" type="text" :placeholder="reader.gender" v-model="changevalue.gender">
          </td>
          <td>
            <div v-if="reader._id != onchangeItem">{{ reader.address }}</div>
            <input v-if="reader._id == onchangeItem" type="text" :placeholder="reader.address" v-model="changevalue.address">
          </td>
          <td>
            <div v-if="reader._id != onchangeItem">{{ reader.phone }}</div>
            <input v-if="reader._id == onchangeItem" type="text" :placeholder="reader.phone" v-model="changevalue.phone">
          </td>
          <td>
            <button @click="onchange(reader._id)"><i class="fa-solid fa-pen"></i></button>           
            <button v-if="reader._id == onchangeItem" @click="savechange(reader._id, reader.name, reader.birthday, reader.gender, reader.address, reader.phone)"><i class="fa-solid fa-save"></i></button>
            <button v-if="reader._id == onchangeItem" @click="deleteItem(reader._id)" :disabled="!selectedItem"><i class="fa-solid fa-trash-alt"></i></button>
          </td>
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
      readerList: [],
      filteredList: [],
      selectedItem: null,
      onchangeItem: '',
      showFilter: false,
      isFiltered: false,
      filterCriteria: {
        name: "",
      },
      changevalue: {
        name: "",
        birthday: "",
        gender: "",
        address: "",
        phone: ""

      },
      newReader: {
        name: "",
        birthday: "",
        gender: "",
        address: "",
        phone: ""
      },
      onCreate: false
    };
  },
  async created() {
    await this.fetchReaderList();
  },
  computed: {
    filteredList() {
      this.isFiltered = this.filterCriteria.name !== "";
      const returnList = this.readerList.filter(reader => 
        reader.name.toLowerCase().includes(this.filterCriteria.name.toLowerCase())
      );
      return returnList;
    }
  },
  methods: {
    async fetchReaderList() {
      try {
        this.readerList = await ReaderService.getAll();
      } catch (error) {
        console.error("Error fetching reader list:", error);
      }
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    unFilter() {
      this.filterCriteria.name = "";
    },
    async deleteItem(reader_id) {
      try {
        if (confirm("Do you want to delete this reader?")) {
          await ReaderService.delete(reader_id);
          await this.fetchReaderList();
          this.$message.success('Reader deleted successfully!');
        }
      } catch (error) {
        console.error("Error deleting reader:", error);
        this.$message.error('Failed to delete reader.');
      }
    },
    onchange(reader_id) {
      this.selectedItem = this.readerList.find(reader => reader._id === reader_id);
      if(this.onchangeItem == reader_id){
        this.onchangeItem='';
      }
      else this.onchangeItem=reader_id;
          this.changevalue['name']='';
          this.changevalue['birthday']='';
          this.changevalue['gender']='';
          this.changevalue['address']='';
          this.changevalue['phone']='';
    },
    async savechange(oldname, oldbirthday, oldgender, oldaddress, oldphone) {
      if (!(this.changevalue['name'] == "" && this.changevalue['birthday'] == "" && this.changevalue['gender'] == "" && this.changevalue['address']=="" && this.changevalue['phone'] == "" )){
                    const data={
                      name: this.changevalue['name'] || oldname,
                      birthday: this.changevalue['birthday'] || oldbirthday,
                      gender: this.changevalue['gender'] || oldgender,
                      address: this.changevalue['address'] || oldaddress,
                      phone: this.changevalue['phone'] || oldphone
                    };
                    try {
                        await ReaderService.update(reader_id, data);
                        await this.fetchReaderList();
                    }catch (error) {
                        console.error("LFailed to update Reader", error);
                    }
                }
                this.onchangeItem='';
                 this.changevalue = {
                  name: "",
                  birthday: "",
                  gender: "",
                  address: "",
                  phone: ""
                };         
            },
    onCreateChange() {
      if (this.onCreate) {
        this.newReader['name'] = '';
        this.newReader['birthday'] = '';
        this.newReader['gender'] = '';
        this.newReader['address'] = '';
        this.newReader['phone'] = '';
      }
      this.onCreate = !this.onCreate;
    },
    async createReader() {
      try {
        if (!this.newReader['name'] =='' || this.newReader['birthday']=='' || this.newReader['gender']=='' || this.newReader['address'] =='' || this.newReader['phone']=='' ) {
          await ReaderService.create(this.newReader);
          await this.fetchReaderList();
          
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

button:last-child {
  margin-right: 0; /* Loại bỏ margin của nút cuối cùng */
}

button:hover {
  background-color: #0056b3;
}

/* FontAwesome Icons */
button i {
  margin-right: 5px;
}



</style>