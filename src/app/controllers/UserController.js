// TEM A REPONSABILIDADE DE FAZER AS REGRAS DE NEGÓCIOS, RECEBER AS INFORMAÇÕES, FAZER VALIDAÇÕES
// POIS É O CONTROLLER QUE VAI CHAMAR O MODEL

// STORE = CADASTRAR / ADICIONAR
// INDEX = LISTAR VÁRIOS
// SHOW = LISTAR APENAS UM
// UPDATE = ATUALIZAR
// DELETE = DELETAR

// IMPORTANDO O V4 PARA GERAR O ID
import { v4 } from 'uuid';

// IMPORTANDO A MODEL DE USER
import User from '../models/User';

// IMPORTANDO TUDO O QUE HÁ NO YUP
import * as Yup from 'yup';

class UserController {
    // MÉTODO DE ADICIONAR USUÁRIO
    async store(request, response) {
        // VALIDAÇÃO, CRIANDO UM SCHEMA DO TIPO OBJECT
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean()
        });

        try {
            // VAI FAZER A VALIDAÇÃO DE FORMA SÍNCRONA, NÃO PRECISA DO AWAIT
            // O VALIDATESYNC PROCURA O PRIMEIRO ERRO, ACHOU, ESTOURA O ERRO E NEM VAI PARA OS OUTROS 
            // COM O OBJETO abortEarly -> CONFIGURA SE ABORTA MAIS CEDO OU NÃO, COM O FALSE ELE PROCURA TODOS OS ERROS 
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            // SE TIVER ALGO DE ERRADO CAI AQUI DENTRO DO CATCH
            // VAI RETORNAR UM JSON COM A MENSAGEM DE ERRO
            return response.status(400).json({ error: err.errors });
        }

        // RECUPERANDO AS INFORMAÇÕES DE DENTRO DO BODY DA REQUISIÇÃO JÁ DESESTRUTURANDO
        const { name, email, password, admin } = request.body;

        // VERIFICANDO SE EXISTE EMAIL DUPLICADO
        // PRECISO BUSCAR O EMAIL LA NO BANCO SE O USUÁRIO EXISTE COM ESSE EMAIL

        // INDO ATÉ NO BANCO E BUSCANDO PELO MENOS UM USUÁRIO QUE TENHA O EMAIL IGUAL AO PASSADO
        // O userExists TRAZ UM OBJETO COM O USUÁRIO ACHADO
        // O findOne FAZ UM SELECT NO BANCO DE DADOS
        const userExists = await User.findOne({
            where: {
                email,
            }
        });

        // VERIFICANDO SE ESSE USUÁRIO EXISTE MESMO
        // O userExists RETORNA TRUE OU FALSE
        // SE O userExists RETORNAR NULL, UNDEFINED OU 0 -> TUDO É FALSO
        // SE RETORNAR {OBJETO VAZIO}, [ARRAY VAZIO] OU 1 -> TUDO É VERDADEIRO
        if (userExists) {
            return response.status(400).json({ error: 'Já existe um usuário com esse e-mail.' });
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin
        });

        return response.status(201).json({
            // RETORNANDO PARA O FRONT-END APENAS ESSAS INFORMAÇÕES
            id: user.id,
            name,
            email,
            admin,
        });
    }

    async index(request, response) {
        // O MÉTODO findAll BUSCA TODAS AS CATEGORIAS QUE ESTÃO NO BANCO
        const users = await User.findAll();
        // retornando todas as categorias
        return response.json(users);
    }

    async delete(request, response) {
        const { id } = request.params;
        await User.destroy({ where: { id } });
        return response.status(200).json();
    }

    async update(request, response) {
        // NÃO PRECISA DO REQUIRED NO MÉTODO DE ATUALIZAR
        const schema = Yup.object({
            name: Yup.string(),
            email: Yup.string().email(),
            password: Yup.string(),
            admin: Yup.boolean()
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        // pegando o id do usuario que vai ser atualizado
        const { id } = request.params;

        // verificando se o usuario existe, procurando pela chave primaria pegando o id pelo request
        const findUser = await User.findByPk(id);

        // se o usuario não existir
        if (!findUser) {
            return response.status(400).json({ error: 'O usuário é inexistente.' });
        }


        // PEGANDO O RESTANTE DAS INFORMAÇÕES DE DENTRO DE request.body
        const { name, email, password, admin } = request.body;


        await User.update({
            name,
            email,
            password,
            admin,
        }, {
            where: {
                id,
            }
        });
        // RETORNANDO A INFORMAÇÃO
        return response.status(200).json();
    }
}

// EXPORTANDO JÁ INSTANCIADO
export default new UserController();
