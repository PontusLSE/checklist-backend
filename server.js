const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const checklistRoutes = require('./routes/checklistRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/checklists', checklistRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});