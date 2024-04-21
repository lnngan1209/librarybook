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