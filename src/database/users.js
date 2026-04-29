const pool = require("./db");


async function cadatrarUsuarioBD(cpf, name, email, senha) {
    const sql = `insert into usuario(cpf_usuario,nome_usuario,email_usuario, senha_usuario, certificado_hash) values ($1, $2, $3, $4) returning *`;
    const values = [cpf, name, email, senha, hash];
    const {rows} = await pool.query(sql,values);
    return rows[0];
}

module.exports={
    cadatrarUsuarioBD
}