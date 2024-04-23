<template>
    <div>
      <h2>Publisher List</h2>
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
          <tr >           
            <th>Name</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="onCreate">
                <td><input type="text" v-model="newPublisher.name"></td>
                <td><input type="text" v-model="newPublisher.address"></td>
                <td><button @click="createPublisher()"><i class="fa-solid fa-save" :disabled="(newPublisher.name == '' || newPublisher.address == '')"></i></button></td>
          </tr>
          <tr v-for="publisher in filteredList" :key="publisher._id">
          <td>
              <div v-if="publisher._id != onchangeItem">{{ publisher.name }}</div>
              <input v-if="publisher._id == onchangeItem" type="text" :placeholder="publisher.name" v-model="changevalue.name">
          </td>
          <td>
              <div v-if="publisher._id != onchangeItem">{{ publisher.address }}</div>
              <input v-if="publisher._id == onchangeItem" type="text" :placeholder="publisher.address" v-model="changevalue.address">
          </td>
          <td>
              <button @click="onchange(publisher._id)"><i class="fa-solid fa-pen"></i></button>           
              <button v-if="publisher._id == onchangeItem" @click="savechange(publisher.name, publisher.address)"><i class="fa-solid fa-save"></i></button>
              <button v-if="publisher._id == onchangeItem" @click="deleteItem" :disabled="!selectedItem"><i class="fa-solid fa-trash-alt"></i></button>
           </td>
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
        publisherList: [],        
        selectedItems: [],
        selectedItem: null,
        onchangeItem: '',
        showFilter: false,
        isFiltered: false,
        onCreate:false,
        filterCriteria: {
          name: "",
        },
        changevalue: {
          name: "",
          address: ""
        },
        newPublisher: {
          name: "",
          address: ""
        }
      };
    },
    async created() {
      await this.fetchPublisherList();
    },
    computed: {
      filteredList() {
        if (this.filterCriteria.name == ""){
          this.isFiltered = false;
        }else this.isFiltered = true;
          const returnList = this.publisherList.filter(publisher => {
          const nameMatched = publisher.name.toLowerCase().includes(this.filterCriteria.name.toLowerCase());
        return nameMatched;
        });
      return returnList;
      }
    },
    methods: {
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
              this.filterCriteria.name="";
              this.isFiltered=false;
            },
            async deleteItem() {
              try {
                if (confirm("Do you want to delete the selected publisher?")) {
                  await PublisherService.delete(this.selectedItem._id);
                  await this.fetchPublisherList();
                  this.selectedItem = null;  // Đặt lại selectedItem về null sau khi xóa
                  this.$message.success('Publisher deleted successfully!');
                } 
              } catch (error) {
                console.error("Error deleting publisher", error);
                this.$message.error('Failed to delete publisher.');
              }
            },
            onchange(publisher_id){
              this.selectedItem = this.publisherList.find(publisher => publisher._id === publisher_id);
                if(this.onchangeItem == publisher_id){
                    this.onchangeItem='';
                }
                else this.onchangeItem=publisher_id;
                this.changevalue['name']='';
                this.changevalue['address']='';
            },
            async savechange(oldname, oldaddress){
                if (!(this.changevalue['name'] == "" && this.changevalue['address']=="")){
                    const data={};
                    this.changevalue['name'] != "" ? data['name']=this.changevalue['name'] : data['name']=oldname;
                    this.changevalue['address'] != "" ? data['address']=this.changevalue['address'] : data['address']=oldaddress;
                    try {
                        await PublisherService.update(this.onchangeItem, data);
                        await this.fetchPublisherList();
                    }catch (error) {
                        console.error("LFailed to update publisher", error);
                    }
                }
                this.onchangeItem='';
                this.changevalue['name']='';
                this.changevalue['address']='';
            },
            onCreateChange(){
                if(this.onCreate){
                    this.newPublisher['name']=='';
                    this.newPublisher['address']=='';
                }
                this.onCreate=!this.onCreate;
            },
            async createPublisher(){
                try{
                    if(!(this.newPublisher['name']=='' || this.newPublisher['address']=='')){
                        await PublisherService.create(this.newPublisher);
                        await this.fetchPublisherList();
                    }
                    this.onCreateChange();
                }catch (error){
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