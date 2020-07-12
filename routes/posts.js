const {jwtAuth} = require('./../middleware/jwtVerify')
const {JsonPlaceholderService} = require('../services/jsonPlaceholderApi')

const userPostApi = (app) => {
    const jsonPlaceholderService = new JsonPlaceholderService    
    app.get('/api/posts', jwtAuth,  async (req,res) => {
        try {
            const posts = await jsonPlaceholderService.posts(req.jwtUser.id) 
            res.status(200).json({ data: posts })
        } catch (error) {
            
        }
    })
}

module.exports = {
    userPostApi
}
