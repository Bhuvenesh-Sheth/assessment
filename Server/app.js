const express = require('express');
const mongoose = require('mongoose');
const ProductTransaction = require('./ProductTransaction.js')
const axios = require('axios');
const { statistics, barchart, piechart } = require('./utils');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://shethbhuvenesh:w9mniHAGWAKrS6vC@cluster0.wwj8uce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());


app.get('/initialize_db', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await ProductTransaction.deleteMany({});
    await ProductTransaction.insertMany(transactions);

    res.status(200).send('Database initialized successfully!');
  } catch (error) {
    res.status(500).send('Error initializing database: ' + error.message);
  }
});


app.get('/get_transactions', async (req, res) => {
  const { search = '', page = 1, perPage = 10 } = req.query;

  
  const query = {
    $or: [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ]
  };

  const searchNumber = parseFloat(search);
  if (!isNaN(searchNumber)) {
    query.$or.push({ price: searchNumber });
  }

  try {
    const transactions = await ProductTransaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await ProductTransaction.countDocuments(query);

    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Error fetching transactions: ' + error.message);
  }
});



app.get('/get_statistics/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const stats = await statistics(month);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Error fetching statistics: ' + error.message);
  }
});

app.get('/get_barchart/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const barChartData = await barchart(month);
    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).send('Error fetching bar chart data: ' + error.message);
  }
});

app.get('/get_piechart/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const pieChartData = await piechart(month);
    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).send('Error fetching pie chart data: ' + error.message);
  }
});

app.get('/get_combined_data/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get(`http://localhost:${PORT}/statistics/${month}`),
      axios.get(`http://localhost:${PORT}/barchart/${month}`),
      axios.get(`http://localhost:${PORT}/piechart/${month}`)
    ]);

    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).send('Error fetching combined data: ' + error.message);
  }
});




app.get('/',(req,res)=>{res.status(200).send('hi, this is my assessment , Bhuvenesh Sheth ')})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
