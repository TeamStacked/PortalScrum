const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env"),
});

const PORT = process.env.PORT;
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());

app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

app.get("/", express.static(pagesPath));
app.get("/cadastro", function(req, res){
    res.sendFile(path.join(pagesPath,"cadastro.html"));
});
app.use("/assets", express.static(assetsPath));
app.use("/api",userRoutes);