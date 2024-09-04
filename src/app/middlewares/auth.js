// IMPORTANDO O JWT 
import jwt from 'jsonwebtoken';

// IMPORTANDO O auth DE DENTRO DE CONFIG
import authConfig from '../../config/auth';

// o next da continuidade ao fluxo da aplicação
// se não usar o next, a aplicação sempre vai ficar travada no middleware
function authMiddleware(request, response, next) {

    const authToken = request.headers.authorization; // pegando la do httpie o authorization

    // PRIMEIRO VOU VERIFICAR SE O TOKEN EXISTE NA REQUISIÇÃO
    // SE NÃO EXISTIR ESSE TOKEN, OU SEJA, SE VIER VAZIO
    if (!authToken) {
        return response.status(401).json({ message: 'Token não existe.' });
    }

    // SEGUNDO VOU VERIFICAR SE O TOKEN É VÁLIDO

    // DENTRO DO TOKEN, EXISTE A PALAVRA BEARER, E EU NÃO NECESSITO DESSA PALAVRA
    // MAS SIM, NECESSITO APENAS DO TOKEN
    // USANDO O SPLIT ELE GERA UM ARRAY, ELE PEGA UMA CADEIA DE CARACTERES, QUE É O AUTHTOKEN
    // E SEPARA ONDE TEM O ESPAÇO NA STRING, PEGANDO A SEGUNDA POSIÇÃO DO ARRAY
    const token = authToken.split(' ').at(1);

    try {
        // este método é capaz de verificar se o token é válido baseado na chave que for
        // passada para ele, por isso o authConfig, pois necessita do secret que há nele
        // e também da pra decodificar o payload do token para poder passar para dentro da 
        // request
        // dentro da arrow function está o erro para verificar se deu algum erro na hora de
        // validar o token
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            // se tiver algum erro
            if (err) {
                // assim que estourar uma exceção, cai direto no catch e eu sei que o token
                // não é válido
                throw new Error();
            }
            //criando uma propriedade dentro da request, que é o userId (id de usuário)
            request.userId = decoded.id;
            //criando uma propriedade dentro da request, que é o userName (nome de usuário)
            request.userName = decoded.name;
        });
    } catch (err) {
        return response.status(401).json({ error: 'O token é inválido' });
    }
    // o next é para continuar a requisição
    return next();
}

export default authMiddleware;