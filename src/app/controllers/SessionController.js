// IMPORTANDO O YUP PARA SABER SE OS DADOS ESTÃO CORRETOS
import * as Yup from 'yup';

// IMPORTANDO A MODEL DE USUÁRIO
import User from '../models/User';

// IMPORTANDO O JWT, VAI AUXILIAR NA GERAÇÃO DO TOKEN
import jwt from 'jsonwebtoken';

// IMPORTANDO O ARQUIVO aut.js PARA SER CHAMADO DENTRO DO MÉTODO sign()
import authConfig from '../../config/auth';

class SessionController {
    // TEMOS O MÉTODO STORE, POIS VAMOS CRIAR UMA SESSÃO
    async store(request, response) {
        // VERIFICAÇÃO PARA VER SE OS DADOS INFORMADOS ESTÃO CORRETOS
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required()
        });
        // AQUI RETORNA TRUE
        const isValid = await schema.isValid(request.body);

        // FUNÇÃO QUE RETORNA A MENSAGEM DE ERRO PARA OS IFS
        const emailOrPasswordIncorrect = () => {
            response.status(401).json({ error: "Email ou senha inválidos." });
        };

        if (!isValid) {
            return emailOrPasswordIncorrect();
        }


        // RECUPERANDO OS DADOS DO USUÁRIO PARA PODER COMPARAR 
        const { email, password } = request.body;

        const user = await User.findOne({
            where: {
                email,
            }
        });

        // SE O USUÁRIO NÃO EXISTIR
        if (!user) {
            return emailOrPasswordIncorrect();
        }

        // tem o await pois o método la em User.js é assincrono
        const isSamePassword = await user.checkPassword(password);

        // se a senha não for a mesma senha vai retornar o erro
        if (!isSamePassword) {
            return emailOrPasswordIncorrect();
        }

        return response.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            // MÉTODO QUE VAI ASSINAR O TOKEN
            // O TOKEN É DIVIDIDO EM TRÊS PARTES: HEADER, PAYLOAD, ASSINATURA 
            token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
                expiresIn: authConfig.expiresIn // authConfig vem da importação
            })
        });
    }
}

export default new SessionController();