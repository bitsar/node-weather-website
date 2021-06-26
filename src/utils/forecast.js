const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=00ec62edf8d4e445f5ae671b5e02d766&query=' + latitude + ',' + longitude + '&units=m'
    
    request ( { url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather services', undefined)
        } else if (body.error) {
            callback('Cannot find location. Try another search', undefined)
        } else {
            callback(undefined, {
                temperature: 'The current temperature is: ' + body.current.temperature, 
                feelslike: '. Feels like temperature: ' + body.current.feelslike,
                description: body.current.weather_descriptions[0],  
            })
        }
    })
}
module.exports = forecast