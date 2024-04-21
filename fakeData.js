const mongoose = require('mongoose');
const config = require("./app/config");
const { reader, book, publisher, borrow, staff } = require('./app/models/models');
const faker = require('faker');

const deleteAllData = async () => {
    try {
        await publisher.deleteMany({});
        console.log("All data from the Publisher table has been deleted.");

        await book.deleteMany({});
        console.log("All data from the Book table has been deleted.");

        await reader.deleteMany({});
        console.log("All data from the Reader table has been deleted.");

        await borrow.deleteMany({});
        console.log("All data from the Borrow table has been deleted.");
        
        await staff.deleteMany({});
        console.log("All data from the Staff table has been deleted.");

    } catch (error) {
        console.error("Error when deleting data", error.message);
    }
};

const createFakeReader = async () => {
    const numberOfFakeReader = 10;

    for (let i = 0; i < numberOfFakeReader; i++) {
        const fakeReaderData = {
            name: faker.name.lastName(),
            birthday: faker.date.between('1950-01-01', '2005-12-31'),
            gender: faker.random.arrayElement(['male', 'female']),
            address: faker.address.streetAddress(),
            phone: "001" + faker.phone.phoneNumberFormat(1).replace(/[-()\s]/g, '').slice(1, 11)
        };
        const newReader = new reader(fakeReaderData);
        await newReader.save();
    }
    console.log("Mock Reader data has been successfully added to the database.");
};

const createFakePublisher = async () => {
    try {
        const numFakePublisher = 10;
        
        const fakePublisherData = [];
        
        for (let i = 0; i < numFakePublisher; i++) {
            const fakePublisher = {
                name: faker.company.companyName(),
                address: faker.address.streetAddress()
            };
            fakePublisherData.push(fakePublisher);
        }
        
        await publisher.insertMany(fakePublisherData);
        console.log("Mock Publisher data has been successfully added to the database.");
    } catch (error) {
        console.error("Error when adding mock data for Publisher", error.message);
    }
};

const getAllPublisher_id = async () => {
    try {
        const publishList = await publisher.find({}, '_id');
        return publishList.map(publisher => publisher._id);
    } catch (error) {
        console.error("Error when fetching the list of Publisher Codes", error.message);
        return [];
    }
};

const createFakeBook = async () => {
    try {
        const fakeBookData = [];
        const numFakeBook = 50;
        const publisher_idList = await getAllPublisher_id();

        for (let i = 0; i < numFakeBook; i++) {
            const fakeBook = {
                name: faker.lorem.words(),
                price: faker.datatype.number({ min: 20, max: 100 }),
                quantity: faker.datatype.number({ min: 1, max: 100 }),
                publication_year: faker.datatype.number({ min: 2000, max: 2023 }),
                publisher_id: faker.random.arrayElement(publisher_idList)
            };
            fakeBookData.push(fakeBook);
        }

        await book.insertMany(fakeBookData);
        console.log("Mock book data has been successfully added to the database");
    } catch (error) {
        console.error("Error when adding mock data for books", error.message);
    }
};

const createFakeStaff = async () => {
    try {
        const numFakeStaff = 5;
        
        const fakeStaffData = [];
        
        for (let i = 0; i < numFakeStaff; i++) {
            const fakeStaff = {
                name: faker.name.findName(),
                Password: faker.internet.password(),
                position: faker.name.jobTitle(),
                address: faker.address.streetAddress(),
                phone: "001" + faker.phone.phoneNumberFormat(1).replace(/[-()\s]/g, '').slice(1, 11)
            };
            fakeStaffData.push(fakeStaff);
        }
        
        await staff.insertMany(fakeStaffData);
        console.log("Mock employee data has been successfully added to the database");
    } catch (error) {
        console.error("Error when adding mock data for staffs", error.message);
    }
};

const getAllReaderID = async () => {
    try {
        const readerList = await reader.find({}, '_id');
        return readerList.map(reader => reader._id);
    } catch (error) {
        console.error("Error when fetching the list of Reader IDs", error.message);
        return [];
    }
};

const getAllBookID = async () => {
    try {
        const BookList = await book.find({}, '_id');
        return BookList.map(Book => Book._id);
    } catch (error) {
        console.error("Error when fetching the list of Book IDs", error.message);
        return [];
    }
};

const createFakeBorrow = async () => {
    try {
        const fakeBorrowData = [];
        const numFakeBorrow = 50;
        const ReaderIDList = await getAllReaderID();
        const BookIDList = await getAllBookID();

        for (let i = 0; i < numFakeBorrow; i++) {
            const fakeBorrow = {
                reader_id: faker.random.arrayElement(ReaderIDList),
                book_id: faker.random.arrayElement(BookIDList),
                borrow_date: faker.date.past(),
                due_date: faker.date.between(faker.date.past(), faker.date.future())
            };
            fakeBorrowData.push(fakeBorrow);
        }

        await borrow.insertMany(fakeBorrowData);
        console.log("Mock data for book borrowing tracking has been successfully added to the database.");
    } catch (error) {
        console.error("Error when adding mock data for book borrowing tracking", error.message);
    }
};

mongoose.connect(config.db.uri)
    .then(async () => {
        console.log("Successfully connected to MongoDB database");

        await deleteAllData();

        await createFakePublisher();
        await createFakeReader();
        await createFakeBook();
        await createFakeStaff();
        await createFakeBorrow();
        
        mongoose.disconnect();
    })
    .catch(error => {
        console.error("Error connecting to MongoDB database:", error.message);
    });
