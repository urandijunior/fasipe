// Servidor de teste — fasipe
// Objetivo: validar que o ambiente (Node, Express, Firebase Admin) está
// funcionando igual nos dois PCs, antes de começar o desenvolvimento real.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota simples — confirma que o servidor está de pé
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'Servidor fasipe rodando com sucesso',
    horario: new Date().toISOString(),
    pc: require('os').hostname(),
  });
});

// Rota de teste do Firebase — só tenta conectar se a chave existir.
// Isso evita que o servidor quebre em um PC que ainda não tem o
// arquivo serviceAccountKey.json configurado.
app.get('/teste-firebase', async (req, res) => {
  const fs = require('fs');
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');

  if (!fs.existsSync(keyPath)) {
    return res.status(200).json({
      status: 'aviso',
      mensagem:
        'Arquivo serviceAccountKey.json não encontrado nesta máquina. ' +
        'Copie o arquivo de credenciais do Firebase para a raiz do projeto ' +
        'para testar a conexão (ele não vai pro Git, é intencional).',
    });
  }

  try {
    const admin = require('firebase-admin');

    // Evita inicializar o app duas vezes se a rota for chamada de novo
    if (!admin.apps.length) {
      const serviceAccount = require(keyPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    // Teste simples: lista as coleções de nível raiz do Firestore
    const db = admin.firestore();
    const collections = await db.listCollections();
    const nomes = collections.map((c) => c.id);

    res.json({
      status: 'ok',
      mensagem: 'Conexão com Firebase funcionando',
      colecoes_encontradas: nomes,
    });
  } catch (erro) {
    res.status(500).json({
      status: 'erro',
      mensagem: 'Falha ao conectar no Firebase',
      detalhe: erro.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Teste a rota principal em http://localhost:${PORT}/`);
  console.log(`Teste o Firebase em http://localhost:${PORT}/teste-firebase`);
});
