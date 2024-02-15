const APIError = require("./APIError")

const createCustomErrorClass = (name, statusCode) => {
    return class CustomError extends APIError {
        constructor(message) {
            super(message, statusCode)
            this.name = name
        }
    }
}

module.exports = {
    NotFound: createCustomErrorClass('NotFound', 404),
    NotAuthorized: createCustomErrorClass('NotAuthorized', 403),
    NotLogged: createCustomErrorClass('NotAuthorized', 401),
    BadRequest: createCustomErrorClass('BadRequest', 400),
    ServerError: createCustomErrorClass('ServerError', 500)
}