let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./config/db');
require('dotenv').config();

// Express Route
const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/category.route')
const questionRoute = require('./routes/question.route')
const contactRoute = require('./routes/contact')

// Configure mongoDB Database
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.set('strictQuery', false);

// Connect MongoDB
const connectDB = require('./config/db');
connectDB(process.env.MY_MONGO_URI);

// Connecting MongoDB Database
mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.db).then(() => {
//     console.log('Database successfully connected!')
// },
//     error => {
//         console.log('Could not connect to database : ' + error)
//     }
// )

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/api/users', userRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/questions', questionRoute)
app.use('/api/contacts', contactRoute);

//* Serve static assets in production, must be at this location of this file
if (process.env.NODE_ENV === 'production') {
    //*Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}


// PORT
const port = process.env.REACT_APP_PORT || 4001;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
    res.status(404).send('Error 404!')
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
