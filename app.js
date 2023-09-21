const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json()); // Parse JSON request bodies
app.use(express.static('src/public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const blogPostRoutes = require('./src/routes/blogRoutes');
app.use('/blogs', blogPostRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
