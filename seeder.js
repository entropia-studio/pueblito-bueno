const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');


// Load models
const Spot = require('./models/Spot');

// Load env vars
dotenv.config({ path: './config/config.env'});


// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const spots = JSON.parse(fs.readFileSync(`${__dirname}/_data/spots.json`, 'utf-8'));


// Import into DB
const importData = async () => {
    try {
        await Spot.create(spots);        
        console.log(`Data imported...`.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Spot.deleteMany();        
        console.log(`Data deleted...`.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d'){
    deleteData();
}



