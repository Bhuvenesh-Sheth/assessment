const express = require('express');
const mongoose = require('mongoose');
const ProductTransaction = require('./ProductTransaction.js')
const axios = require('axios');
var cors = require('cors')
const { statistics, barchart, piechart } = require('./utils');
const app = express();
const swaggerSetup = require('./swagger');
const PORT = 3001;
const MONGO_URI = 'mongodb+srv://<uname>:<pswd>@cluster0.wwj8uce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';




mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors())

swaggerSetup(app);


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


/**
 * @swagger
 * /get_transactions:
 *   get:
 *     summary: Retrieve transactions with optional search and pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text for title, description, or price
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/ProductTrasaction'
 *                 total:
 *                   type: integer
 *                   description: Total number of transactions
 *       '500':
 *         description: Internal server error
 */
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



/**
 * @swagger
 * /get_statistics/{month}:
 *   get:
 *     summary: Get statistics for a specific month
 *     parameters:
 *       - in: path
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Month (1-12) for which statistics are to be fetched
 *     responses:
 *       '200':
 *         description: Statistics for the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSaleAmount:
 *                   type: number
 *                   description: Total sale amount for the month
 *                 totalSoldItems:
 *                   type: integer
 *                   description: Total number of sold items for the month
 *                 totalNotSoldItems:
 *                   type: integer
 *                   description: Total number of not sold items for the month
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /get_barchart/{month}:
 *   get:
 *     summary: Get bar chart data for price ranges in a specific month
 *     parameters:
 *       - in: path
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Month (1-12) for which bar chart data is to be fetched
 *     responses:
 *       '200':
 *         description: Bar chart data for the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   range:
 *                     type: string
 *                     description: Price range
 *                   count:
 *                     type: integer
 *                     description: Number of items in the price range
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /get_piechart/{month}:
 *   get:
 *     summary: Get pie chart data for categories in a specific month
 *     parameters:
 *       - in: path
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Month (1-12) for which pie chart data is to be fetched
 *     responses:
 *       '200':
 *         description: Pie chart data for the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     description: Product category
 *                   count:
 *                     type: integer
 *                     description: Number of items in the category
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /get_combined_data/{month}:
 *   get:
 *     summary: Get combined data for statistics, bar chart, and pie chart for a specific month
 *     parameters:
 *       - in: path
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         required: true
 *         description: Numeric value representing the month (1-12)
 *     responses:
 *       '200':
 *         description: Combined data for the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     totalSaleAmount:
 *                       type: number
 *                     totalSoldItems:
 *                       type: integer
 *                     totalNotSoldItems:
 *                       type: integer
 *                   example:
 *                     totalSaleAmount: 2500
 *                     totalSoldItems: 35
 *                     totalNotSoldItems: 15
 *                 barChart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       range:
 *                         type: string
 *                       count:
 *                         type: integer
 *                   example:
 *                     - range: "0-100"
 *                       count: 12
 *                     - range: "101-200"
 *                       count: 25
 *                 pieChart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       count:
 *                         type: integer
 *                   example:
 *                     - category: "Electronics"
 *                       count: 20
 *                     - category: "Clothing"
 *                       count: 15
 */
app.get('/get_combined_data/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get(`http://localhost:${PORT}/get_statistics/${month}`),
      axios.get(`http://localhost:${PORT}/get_barchart/${month}`),
      axios.get(`http://localhost:${PORT}/get_piechart/${month}`)
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
