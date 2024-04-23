<template>
    <header>
        
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <div class="mr-auto navbar-nav">
                
                <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
                <RouterLink :to="{ name: 'publisher' }" class="nav-link">Publisher</RouterLink>
                <RouterLink :to="{ name: 'book' }" class="nav-link">Book</RouterLink>
                <RouterLink :to="{ name: 'staff' }" class="nav-link">Staff</RouterLink>
                <RouterLink :to="{ name: 'reader' }" class="nav-link">Reader</RouterLink>
                <RouterLink :to="{ name: 'borrow' }" class="nav-link">Borrowing</RouterLink>
            </div>
        </nav>
    </header>   
</template>

<style scoped>
  /* CSS cho các liên kết trong navbar */
  .nav-link {
    font-size: 18px;       /* Đặt kích thước chữ là 18px */
    margin-right: 20px;   /* Đặt khoảng cách bên phải là 20px */
    text-transform: uppercase; /* Chuyển đổi chữ thành chữ in hoa */
  }  

header:after{
  content: "beta";
  position: fixed;
  z-index: 1070;
  width: 80px;
  height: 25px;
  background: #0077b6;
  top: 7px;
  left: -20px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  font-family: sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  line-height: 27px;
  -ms-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  transform:rotate(-45deg);
}
</style>