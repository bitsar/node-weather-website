const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath))

// Route handlers
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Nick'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Nick'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Nick',
        text: 'This is where to get help'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    
    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    // destructured {lat, long, location} = {} default empty object if location invalid
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send( {error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send( {error} )
            }

            res.send({
                forecast: forecastData,
                location, 
                address
            })
            
        })

    })

})


app.get('/products', (req, res) => {
    
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404-error', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Nick'
    })
})

app.get('*', (req, res) => {
    res.render('404-error', {
        title: '404',
        errorMessage: 'Oooops, nothing to see here',
        name: 'Nick'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})