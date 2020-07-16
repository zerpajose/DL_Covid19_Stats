const {jwtAuth} = require('./../middleware/jwtVerify')
const {Covid19} = require('../services/covidApi')

const filteredChile = (data) => {
    return data.filter(country => country['Country/Region'] === 'Chile')[0]
}

const covid19Api = (app) => {
    const covid19 = new Covid19    
    app.get('/api/total', jwtAuth,  async (req,res) => {
        try {
            const data = await covid19.all() 
             res.status(200).json(data)
        } catch (error) {
            console.log(error)
        }
    })
    app.get('/api/chile', jwtAuth,  async (req,res) => {
        try {
            const chile = await covid19.chile() 
            console.log(chile)
            res.status(200).json(chile)
        } catch (error) {
            console.log(error) 
        }
    })
    app.get('/api/confirmed', jwtAuth,  async (req,res) => {
        try {
            const {confirmed} = await covid19.confirmed() 
            const chile = filteredChile(confirmed)
            res.status(200).json({data: chile})
        } catch (error) {
            console.log(error) 
        }
    })
    app.get('/api/deaths', jwtAuth,  async (req,res) => {
        try {
            const {deaths} = await covid19.deaths() 
            const chile = filteredChile(deaths)
            res.status(200).json({data: chile})
        } catch (error) {
            console.log(error) 
        }
    })
    app.get('/api/recovered', jwtAuth,  async (req,res) => {
        try {
            const {recovered} = await covid19.recovered() 
            const chile = filteredChile(recovered)
            res.status(200).json({data: chile})
        } catch (error) {
            console.log(error) 
        }
    })
}

module.exports = {
    covid19Api 
}
