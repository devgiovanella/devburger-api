import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),

        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        // VERIFICAÇÃO SE O USUÁRIO É ADMINISTRADOR
        // vai lá na tabela de usuários e procura pelo chave primaria (id do usuário)
        // o id de usuário vem dentro da request
        // vai retornar todo o objeto de usuário, por isso deve-se desesstruturar para pegar
        // somente o admin
        //  const isAdmin = await User.findByPk(request.userId)
        const { admin: isAdmin } = await User.findByPk(request.userId);
        // verificação, se o usuário não for administrador, ou seja, se for falso     
        if (!isAdmin) {
            return response.status(401).json({ message: 'O usuário não é administrador.' });
        }

        const { filename: path } = request.file;

        const { name } = request.body;

        // armazenando o select dentro da variavel categoryExists
        const categoryExists = await Category.findOne({
            where: {
                name,
            }
        });

        // verificando se existe alguma categoria com esse nome
        if (categoryExists) {
            return response.status(400).json({ message: 'Já existe uma categoria com este nome.' });
        }

        // se der tudo certo no if, cadastra a categoria
        const category = await Category.create({
            name,
            path
        });

        return response.status(201).json({ id: category.id, name });
    }

    async index(request, response) {
        // O MÉTODO findAll BUSCA TODAS AS CATEGORIAS QUE ESTÃO NO BANCO
        const categories = await Category.findAll();
        // retornando todas as categorias
        return response.json(categories);
    }

    async update(request, response) {
        // deixando tudo opcional
        const schema = Yup.object({
            name: Yup.string(),

        });
        // fazendo a validação com yup, para ver se o corpo da requisição está correto
        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        // VERIFICAÇÃO SE O USUÁRIO É ADMINISTRADOR
        // vai lá na tabela de usuários e procura pelo chave primaria (id do usuário)
        // o id de usuário vem dentro da request
        // vai retornar todo o objeto de usuário, por isso deve-se desesstruturar para pegar
        // somente o admin
        //  const isAdmin = await User.findByPk(request.userId)
        const { admin: isAdmin } = await User.findByPk(request.userId);

        // verificação, se o usuário não for administrador, ou seja, se for falso     
        if (!isAdmin) {
            // se não for admin, estoura esse erro
            return response.status(401).json({ message: 'O usuário não é administrador.' });
        }

        // pegando o id da categoria que vai ser atualizada
        const { id } = request.params;

        // verificando se a categoria existe, produrando pela chave primaria pegando o id pelo request
        const findCategory = await Category.findByPk(id);

        // se a categoria não existir
        if (!findCategory) {
            // estoura esse erro
            return response.status(400).json({ error: 'A categoria é inexistente.' });
        }

        // deixando o arquivo opcional   
        let path;
        // se existir o arquivo atualiza
        // se não existir, deixa null
        if (request.file) {
            path = request.file.filename;
        }
        // pegando o name do corpo da requisição, la do HTTPIE
        const { name } = request.body;

        // se tiver o nome no corpo da requisição, faz a verificação, senão vai ignorar
        if (name) {
            // armazenando o select dentro da variavel categoryExists
            const categoryNameExists = await Category.findOne({
                where: {
                    name,
                }
            });

            // verificando se existe alguma categoria com esse nome
            // && se eu passar o mesmo nome: estou editando a categoria hamburguer
            // e eu passar o mesmo nome, não tem porque dar erro,
            // então verifica se o id dessa categoria é o mesmo que eu estou tentando editar
            if (categoryNameExists && categoryNameExists.id !== +id) {
                return response.status(400).json({ message: 'Já existe uma categoria com este nome.' });
            }
        }


        // se der tudo certo no if, cadastra a categoria
        await Category.update({
            name,
            path
        }, {
            where: {
                id
            }
        });

        return response.status(200).json();
    }

    async delete(request, response) {
        const { id } = request.params;
        await Category.destroy({ where: { id } });
        return response.status(200).json();
    }
}


export default new CategoryController();