import os
print("========================================================================")
print("bienvennue dans le script d'installation de dépendances")
commands= {
        "npm install express",
        "npm install nodemon --save-dev",
        "npm install sequelize",
        "npm install mysql2",
        "npm install sqlite3",
        "npm install --save-dev jest supertest",
        "npm install bcrypt",
        "npm install http-errors",
        "npm install jsonwebtoken",
        "npm install express-openapi-validator"
        }
for command in commands:
    print("execution de la commande ⇒  "+command)
    os.system(command)
print("========================================================================")