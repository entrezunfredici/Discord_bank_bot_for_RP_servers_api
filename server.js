const port = 8080;
const db = require('./models/index');
const app = require('./app');
// Start the server on the given port
db.instance.sync({force: true}).then(async () =>{
    app.listen(port, () => {
        console.log('Server is running on port', port)
    })
}).catch((e) => {
    console.rerror(e);
})