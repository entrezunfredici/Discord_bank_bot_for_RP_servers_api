const express = require('express')
const app = express()
const OpenApiValidator = require('express-openapi-validator') // Module pour valider automatiquement les requêtes

// Force express to convert all requests entities as json (for body)
//app.use(cors());
app.use(express.json())

//Middleware d'openAPI
// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: './open-api.yaml',
//         ignoreUndocumented: true
//     })
// )

/* For allow to use
    pour ajouter un router au serveur il est nécéssaire d'utiliser les deux commandes suivantes:
    et remplacer <router> par le nom de votre routeur
    yourRouter par le nom que vous voulez
    et yourService par le nom de votre service
    const yourRouter = require('./routers/<router>')
    app.use('/<router>', yourRouter)
*/

//router pour les comptes bancaires
//router pour les comptes bancaires
const accountRouter = require('./routers/account')
app.use('/account', accountRouter)
//router pour les contacts
const contactRouter = require('./routers/contact')
app.use('/contact', contactRouter)
//router pour les payments réguliers
const regularMoneyExchangesRouter = require('./routers/regularMoneyExchanges')
app.use('/regularMoneyExchange', regularMoneyExchangesRouter)
//routeur pour les echanges
const moneyExchangesRouter = require('./routers/moneyExchange')
app.use('/moneyExchange', moneyExchangesRouter)

module.exports = app
