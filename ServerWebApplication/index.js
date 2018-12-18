
var express = require('express'); 
const bodyParser = require('body-parser');
var app = express();

var fs = require("fs");

var mongoose = require('mongoose')
var mongoDB = 'mongodb://admin:Testpassword1@ds135974.mlab.com:35974/zpw-byhkalo'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
var Product = require('./models/product')
var Setting = require('./models/setting')

var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
        console.log("Przykładowa aplikacja nasłuchuje na http://%s:%s", host, port)
    }
);
    
var io = require('socket.io')(server);
io.on('connection', function(client) {
    console.log('Client connected...')
    client.emit('products' , true);
    // io.sockets.send('products')
});

// Add headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.all('/*',function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    console.log("Otrzymano żądanie GET dla strony głównej"); res.send('Hello GET');
})

app.get('/serverTypeFirebase', function (req, res) {
    Setting.findOne((err, setting) => {
        if (err) {
            console.log('Get Server Setting error = ');
            console.log(error);
        }
        res.json(setting)
    })
})

app.post('/serverTypeFirebase', function (req, res) {
    console.log('POST serverTypeFirebase');
    let updateSetting = new Setting(req.body)
    Setting.findOne((err, setting) => {
        if (err) {
            console.log('Get Server Setting error = ');
            console.log(error);
        }
        let settingForUpdate = new Setting(setting)
        settingForUpdate.serverTypeFirebase = updateSetting.serverTypeFirebase
        settingForUpdate.save(function(err) {
            if (err) {
                console.log('error in SAVE  SETTING process = ')
                console.log(err)
            } else {
                res.status(200).send;
                io.sockets.emit('serverSetting', updateSetting.serverTypeFirebase)
            }
        })
    })
})

// Products
app.get('/products', function (req, res) {
    Product.find( (error, products) => {
        if (error) {
            console.log('error = ');
            console.log(error);
        }
        res.json(products);
    });
})

app.post('/products', function (req, res) {
    var newProduct = new Product(req.body);
    console.log('new Product = ' + newProduct);

    newProduct.save(function (err) {
        if (err) {
            console.log('error in SAVE process = ')
            console.log(err)
        }
        res.send('Hello POST');
        io.sockets.emit('products', true)
    })
})
app.put('/products', function (req, res) {
    var productWithNewInfo = new Product(req.body);
    console.log('productWithNewInfo = ');
    console.log(productWithNewInfo);
    let product_id = productWithNewInfo.id
    var tempProductToUpdateQuery = Product.find({'id':product_id}, (error, products) => {
        console.log('products = ');
        console.log(products);
        let productToUpdate = new Product(products[0]);
        productToUpdate.name = productWithNewInfo.name;
        productToUpdate.description = productWithNewInfo.description;
        productToUpdate.count = productWithNewInfo.count;
        productToUpdate.price = productWithNewInfo.price;
        productToUpdate.imageUrl = productWithNewInfo.imageUrl;
        productToUpdate.promotionId = productWithNewInfo.promotionId;
        console.log('productToUpdate = ');
        console.log(productToUpdate);
        console.log('error = ');
        console.log(error);
        productToUpdate.save(function(err) {
            if (err) {
                console.log('error in PUT & UPDATE process = ')
                console.log(err)
            } else {
                res.json(products);
                // io.sockets.send('products')
                io.sockets.emit('products', true)
            }
        })
    })
})

app.delete('/products/:product_id', function (req, res) {
    console.log('Try to delete')
    var tempProductToDeleteQuery = Product.find({'id':req.params.product_id}, (error, products) => {
        console.log('products = ');
        console.log(products);
        let productToDelete = new Product(products[0]);
        productToDelete.delete(function(err) {
            if (err) {
                console.log('error in DELETE & DELETE process = ')
                console.log(err)
            } else {
                console.log('deleteD!!!')
                res.json(products);
                // io.sockets.send('products')
                io.sockets.emit('products', true)
            }
        })
    })
    
})

