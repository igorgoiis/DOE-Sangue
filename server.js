//Configurando o servidor
const express = require('express');
const server = express();

//Configurando o servidor para apresentar os arquivos estáicos
server.use(express.static('public'));

//habilitar o corpo do formulário
server.use(express.urlencoded({ extended: true }));

//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'doe',
});

//Configurando a template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true,
})

//Configurar a apresentação da página
server.get('/', (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.send('Erro no banco de dados.');
    
    const donors = result.rows;
    return res.render('index.html', { donors });
  })
});

//Pegar dados do formulário
server.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;
  
  if (!name || !email || !blood)
    return res.send('Todos os campos são obrigatórios.');

  //Colocando valores dentro do banco de dados
  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`;

  const values = [name, email, blood];
  db.query(query, values, function(err) {
    //Fluxo de erro
    if (err) return res.send('Erro no banco de dados.')
    //Fluxo ideal
    return res.redirect('/');
  });

})

//Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
  console.log('Servidor iniciado.')
});