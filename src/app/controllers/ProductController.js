import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            //category: Yup.string().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean()
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

        // PEGANDO A INFORMAÇÃO DO ARQUIVO
        // ELE NÃO VEM MAIS DENTRO DO request.body
        // ELE VEM DE request.file
        // DESESTRUTURANDO O filename E RENOMEANDO PARA path DE DENTRO DE request.file
        const { filename: path } = request.file;

        // PEGANDO O RESTANTE DAS INFORMAÇÕES DE DENTRO DE request.body
        const { name, price, category_id, offer } = request.body;

        // CRIANDO O REGISTRO NO BANCO DE DADOS
        const product = await Product.create({
            name,
            price,
            //category,
            category_id,
            path,
            offer
        });
        // RETORNANDO A INFORMAÇÃO
        return response.status(201).json({ product });
    }

    async index(request, response) {
        // O MÉTODO findAll BUSCA TODOS OS PRODUTOS QUE ESTÃO NO BANCO
        const products = await Product.findAll({
            // quero incluir 
            include: [{
                // vai trazer a model Category
                model: Category,
                // chave que configuramos la no metodo associate() em Product.js
                as: 'category',
                // quero que traga essas informações, se é pra trazer todas, 
                // não precisa do attributes
                attributes: ['id', 'name']
            }]
        });
        // retornando todos os produtos
        return response.json(products);
    }

    async delete(request, response) {
        const { id } = request.params;
        await Product.destroy({ where: { id } });
        return response.status(200).json();
    }

    async update(request, response) {
        // NÃO PRECISA DO REQUIRED NO MÉTODO DE ATUALIZAR
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            //category: Yup.string(),
            category_id: Yup.number(),
            offer: Yup.boolean()
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

        // pegando o id do produto que vai ser atualizado
        const { id } = request.params;

        // verificando se o produto existe, produrando pela chave primaria pegando o id pelo request
        const findProduct = await Product.findByPk(id);

        // se o produto não existir
        if (!findProduct) {
            return response.status(400).json({ error: 'O produto é inexistente.' });
        }

        // DEIXANDO A IMAGEM OPCIONAL
        // SE NÃO MUDAR, VAI MANTER A MESMA
        let path;

        // se exixtir na requisição
        // esse bloco de código é igual à const { filename: path } = request.file;
        // mas de forma opcional
        if (request.file) {
            path = request.file.filename;
        }

        // PEGANDO O RESTANTE DAS INFORMAÇÕES DE DENTRO DE request.body
        const { name, price, category_id, offer } = request.body;


        await Product.update({
            name,
            price,
            //category,
            category_id,
            path,
            offer
        }, {
            where: {
                id,
            }
        });
        // RETORNANDO A INFORMAÇÃO
        return response.status(200).json();
    }
}

export default new ProductController();