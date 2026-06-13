// One-off script to create the admin account used to log in to /admin and /dashboard.
// Usage: node src/seed/createAdmin.js <username> <password>
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../users/user.model');

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.error('Usage: node src/seed/createAdmin.js <username> <password>');
    process.exit(1);
}

async function run() {
    await mongoose.connect(process.env.DB_URL);

    const existing = await User.findOne({ username });
    if (existing) {
        existing.password = password;
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated existing admin user "${username}".`);
    } else {
        await User.create({ username, password, role: 'admin' });
        console.log(`Created admin user "${username}".`);
    }

    await mongoose.disconnect();
}

run().catch((error) => {
    console.error('Failed to create admin user', error);
    process.exit(1);
});
