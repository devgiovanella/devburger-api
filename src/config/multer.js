// IMPORTANDO O MULTER
import multer from "multer";

// IMPORTANDO O EXTNAME E O RESOLVE LA DO NODE:PATH
import { extname, resolve } from 'node:path';

// IMPORTANDO O V4 DO UUID
// o v4 vai trocar o nome da imagem para o id do item que vamos salvar
// imagine que eu vou salvar uma imagem com nome de teste.png e o outro usuário salve 
// uma nova imagem com o nome de teste.png
import { v4 } from "uuid";

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'), // destino que vai ir os arquivos
        filename: (request, file, callback) => {
                // concatenando o id do item salvo + a extensão do arquivo (png,jpg...)
                return callback(null, v4() + extname(file.originalname))
        },
    }),
};

