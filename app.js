const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

// Dicionário de MIME Types para o navegador entender o que é cada arquivo
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Se a requisição for para a raiz ('/'), direciona para o index.html. 
  // Caso contrário, usa a própria URL requisitada (ex: '/style.css')
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  
  // Cria o caminho completo do arquivo no sistema
  const filePath = path.join(__dirname, urlPath);
  
  // Extrai a extensão do arquivo (ex: '.css')
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Define o Content-Type com base na extensão. Se não reconhecer, manda como binário genérico.
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Lê o arquivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Erro 404: Arquivo não encontrado
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro 404: O arquivo ${urlPath} não foi encontrado.`);
      } else {
        // Erro 500: Outros erros de servidor
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro interno no servidor: ${err.code}`);
      }
    } else {
      // Sucesso: Devolve o conteúdo com o status 200 e o Content-Type correto
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Inicia o servidor
server.listen(port, hostname, () => {
  console.log(`Servidor iniciado na porta ${port}`);
  console.log(`- Acesso no seu computador: http://localhost:${port}`);
});