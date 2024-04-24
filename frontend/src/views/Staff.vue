<template>
  <div>
    <h2>Staff List</h2>
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
          <th>Position</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Action</th> 
        </tr>
      </thead>
      <tbody>
        <tr v-if="onCreate">
          <td><input type="text" v-model="newStaff.name"></td>
          <td><input type="text" v-model="newStaff.position"></td>
          <td><input type="text" v-model="newStaff.address"></td>
          <td><input type="text" v-model="newStaff.phone"></td>
          <td><button @click="createStaff()"><i class="fa-solid fa-save"></i></button></td>
        </tr>
        <tr v-for="staff in filteredList" :key="staff._id">
          <td>
            <div v-if="staff._id != onchangeItem">{{ staff.name }}</div>
            <input v-if="staff._id == onchangeItem" type="text" :placeholder="staff.name" v-model="changevalue.name">
          </td>
          <td>
            <div v-if="staff._id != onchangeItem">{{ staff.position }}</div>
            <input v-if="staff._id == onchangeItem" type="text" :placeholder="staff.position" v-model="changevalue.position">
          </td>
          <td>
            <div v-if="staff._id != onchangeItem">{{ staff.address }}</div>
            <input v-if="staff._id == onchangeItem" type="text" :placeholder="staff.address" v-model="changevalue.address">
          </td>
          <td>
            <div v-if="staff._id != onchangeItem">{{ staff.phone }}</div>
            <input v-if="staff._id == onchangeItem" type="text" :placeholder="staff.phone" v-model="changevalue.phone">
          </td>
          <td>
            <button @click="onchange(staff._id)"><i class="fa-solid fa-pen"></i></button>
            <button v-if="staff._id == onchangeItem" @click="savechange(staff._id, staff.name, staff.position, staff.address, staff.phone)">
              <i class="fa-solid fa-save"></i>
            </button>
            <button v-if="staff._id == onchangeItem" @click="deleteItem" :disabled="!selectedItem"><i class="fa-solid fa-trash-alt"></i></button>
          </td>
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
      staffList: [],
      onchangeItem: '',
      selectedItems: [],
      selectedItem: null,
      onchangeItem: '',
      showFilter: false,
      isFiltered: false,
      newStaff: {
        name: "",
        position: "",
        address: "",
        phone: ""
      },
      changevalue: {
        name: "",
        position: "",
        address: "",
        phone: ""
      },
      filterCriteria:{
        name: ""
      },
      onCreate: false
    };
  },
  async created() {
    await this.fetchStaffList();
  },
  computed: {
      filteredList() {
        if (this.filterCriteria.name == ""){
          this.isFiltered = false;
        }else this.isFiltered = true;
          const returnList = this.staffList.filter(staff => {
          const nameMatched = staff.name.toLowerCase().includes(this.filterCriteria.name.toLowerCase());
        return nameMatched;
        });
      return returnList;
      }
    },
  methods: {
    async fetchStaffList() {
        try {
          this.staffList = await StaffService.getAll();
        } catch (error) {
          console.error("Error fetching Staff list", error);
        }
      },
      toggleFilter() {
        this.showFilter = !this.showFilter;
            },
            unFilter() {
              this.filterCriteria.name="";
              this.isFiltered=false;
            },
            async deleteItem() {
              try {
                if (confirm("Do you want to delete the selected Staff?")) {
                  await StaffService.delete(this.selectedItem._id);
                  await this.fetchStaffList();
                  this.selectedItem = null;  // Đặt lại selectedItem về null sau khi xóa
                  this.$message.success('Staff deleted successfully!');
                } 
              } catch (error) {
                console.error("Error deleting Staff", error);
                this.$message.error('Failed to delete Staff.');
              }
            },
            onchange(staff_id){
              this.selectedItem = this.staffList.find(staff => staff._id === staff_id);
                if(this.onchangeItem == staff_id){
                    this.onchangeItem='';
                }
                else this.onchangeItem=staff_id;
                this.changevalue['name']='';
                this.changevalue['position']='';
                this.changevalue['address']='';
                this.changevalue['phone']='';
            },

            async savechange(oldname, oldposition, oldaddress, oldphone) {
              if (!(this.changevalue['name'] == "" && this.changevalue['position'] == "" && this.changevalue['address']=="" && this.changevalue['phone'] == "")){
                  
                  const data = {
                      name: this.changevalue['name'] !== "" ? this.changevalue['name'] : oldname,
                      position: this.changevalue['position'] !== "" ? this.changevalue['position'] : oldposition,
                      address: this.changevalue['address'] !== "" ? this.changevalue['address'] : oldaddress,
                      phone: this.changevalue['phone'] !== "" ? this.changevalue['phone'] : oldphone
                  };
                  
                  try {
                      await StaffService.update(this.onchangeItem, data);
                      await this.fetchStaffList();
                  } catch (error) {
                      console.error("Failed to update Staff", error);
                  }
              }
              
              this.resetChangeValues();
          },

resetChangeValues() {
    this.onchangeItem = '';
    this.changevalue['name'] = '';
    this.changevalue['position'] = '';
    this.changevalue['address'] = '';
    this.changevalue['phone'] = '';
},
    
    onCreateChange() {
      if (this.onCreate) {
        this.newStaff['name'] = '';
        this.newStaff['position'] = '';
        this.newStaff['address'] = '';
        this.newStaff['phone'] = '';
      }
      this.onCreate = !this.onCreate;
    },
    async createStaff() {
      try {
        if (!(this.newStaff['name'] == '' || this.newStaff['position'] == '' || this.newStaff['address'] == '' || this.newStaff['phone'] == '')) {
          await StaffService.create(this.newStaff);
          await this.fetchStaffList();
        }
        this.onCreateChange();
      } catch (error) {
        console.log('Error when adding staff', error);
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