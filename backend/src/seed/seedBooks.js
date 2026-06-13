// One-off script to populate the books collection with sample data.
// Usage: node src/seed/seedBooks.js
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../books/book.model');
const books = require('./books.json');

async function run() {
    await mongoose.connect(process.env.DB_URL);

    const existingCount = await Book.countDocuments();
    if (existingCount > 0) {
        console.log(`Books collection already has ${existingCount} document(s). Skipping seed.`);
    } else {
        await Book.insertMany(books);
        console.log(`Inserted ${books.length} sample books.`);
    }

    await mongoose.disconnect();
}

run().catch((error) => {
    console.error('Failed to seed books', error);
    process.exit(1);
});
