const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({
    quiet: true,
});
const router = require("./routes");
const { blockAuthMiddleware } = require("./middlewares/auth.middleware");
const path = require("path");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const pagesPublicPath = path.join(pagesPath, "public");
const pagesPrivatePath = path.join(pagesPath, "private");
const assetsPath = path.join(publicPath, "assets");

const imagensQuestoesPath = path.join(
    __dirname,
    "infra",
    "init",
    "seed-data",
    "imagens",
);

app.use("/assets", express.static(assetsPath));
app.use("/imagens/questoes", express.static(imagensQuestoesPath));

app.use("/api", router);

// Rotas publicas
app.get("/", blockAuthMiddleware, (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "login.html"));
});

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "cadastro.html"));
});

app.get("/certificado/:hash", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "certificado.html"));
});

app.get("/certificado.html", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "certificado.html"));
});

app.get("/404", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "404.html"));
});

// Rotas privadas
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "dashboard.html"));
});

app.get("/exame", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "exame.html"));
});

app.get("/hub", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "hub.html"));
});

app.get("/material-estudo", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "material-estudo.html"));
});

app.get("/material-estudos", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "material-estudos.html"));
});

app.get("/modulos", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "modulos.html"));
});

app.get("/perfil", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "perfil.html"));
});

app.get("/resultado", (req, res) => {
    res.sendFile(path.join(pagesPrivatePath, "resultado.html"));
});

app.use(function (req, res) {
    res.redirect("/404");
});

app.listen(PORT, function () {
    console.log(`Rodando em: http://localhost:${PORT}`);
});
