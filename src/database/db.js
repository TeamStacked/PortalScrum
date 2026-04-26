const dotenv = require("dotenv");
const path = require("path");

//configurando dotenv
dotenv.config({
quiet: true,
path: path.resolve(__dirname, "..", "..", ".env"),
});

//pegando a função pool para o database
const { Pool } = require("pg");

//configuração  para conectar o database
const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
};
//chamando a conexão do banco de dados
const pool = new Pool(config);

//exportando varialvel pool para outros arquivos
module.exports = pool;