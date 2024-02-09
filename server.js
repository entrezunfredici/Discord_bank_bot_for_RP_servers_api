const port = 8080;
const db = require('./models/index');
const app = require('./app');

db.instance.sync({force: true}).then(async () =>{
    app.listen(port, () => {
        console.log('Server is running on port', port)
    })
}).catch((e) => {
    console.rerror(e);
})