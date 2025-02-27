//Lidar com manipulação de arquivos em node
const fs = require('node:fs');
//Lidar com os diretórios
const path = require('node:path');
const uploadConfig = require('../configs/upload');

class DiskStorage {
 async saveFile(file) {
  // Mudança de arquivo de lugar.
  // a função "rename": renomeia ou move o arquivo, neste caso está movendo o arquivo.
  await fs.promises.rename(
   // a função "resolve": resolve uma sequência de segmentos de caminho para um caminho absoluto.
   path.resolve(uploadConfig.TMP_FOLDER, file),
   path.resolve(uploadConfig.UPLOADS_FOLDER, file)
  )
  return file
 }
 
 async deleteFile(file){
  const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)
  try{
   // o "stat" retorna o status do arquivo.
   await fs.promises.stat(filePath)
  }catch{
   return
  }
  // função "unlink" remove o arquivo.
  await fs.promises.unlink(filePath)
 }

 async sendFile(response, filePath) {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    response.setHeader('Content-Type', 'image/jpeg');
    response.send(fileBuffer);
  } catch (err) {
    response.status(404).send({ message: 'Imagem não encontrada' });
  }
}
}

module.exports = DiskStorage