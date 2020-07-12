const axios = require('axios')
const JSONPLACEHOLDERAPI = 'https://jsonplaceholder.typicode.com'

class JsonPlaceholderService {
    posts(user) {
        return axios.get(`${JSONPLACEHOLDERAPI}/users/${user}/posts`).then(r => r.data)
    }
}
module.exports = {
    JsonPlaceholderService
}