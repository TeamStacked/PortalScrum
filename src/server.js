const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

//configuração de dotenv
dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env"),
});

const PORT = process.env.PORT;
//criando variavel para a api rotas
const userRoutes = require("./routes/user.routes");

const app = express();
//abilita que o servidor entenda os JSON
app.use(express.json());

//iniciar o servidor localhost
app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});

//varieaveis para localizar os arquivo do servidor
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

//criando caminho para o index
app.get("/", express.static(pagesPath));
//criando caminho para o cadastro
app.get("/cadastro", function(req, res){
    res.sendFile(path.join(pagesPath,"cadastro.html"));
});
//localizando parte visula do site
app.use("/assets", express.static(assetsPath));
//criando api rota
app.use("/api",userRoutes);