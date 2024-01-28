const port = 8000;
const app = require('./app');
const db = require('./models/index');
// Start the server on the given port
db.instance.sync({force: true}).then(async () => {
    console.log('Database connected and synchronized');
    app.listen(port, () => {
        console.log('Server is running on port', port)
    })
}).catch((e)=>{
    console.error(e);
})
