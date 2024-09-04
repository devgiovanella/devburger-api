import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
    async store (request, response) {
        const schema = Yup.object({
            // ARRAY DE PRODUTOS COM A QUANTIDADE E O NOME
            // NÃO É SEGURO MOSTRAR O PREÇO E OUTRAS INFORMAÇÕES
            // POIS COM O ID EU CONSIGO SABER QUAL PRODUTO É 
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                })
            ),
            
        });

        /**
         No schema, estou passando apenas um array de produtos. Nessa array, temos o id de
         produto e a quantidade. Com o id eu consigo acessar todas as informações necessárias
         para cada produto, ou seja, para retornar ao front.
         */
        
        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch(err) {
            return response.status(400).json({ error: err.errors});
        }

        // estou pegando os products (array passado logo acima)
        const { products } = request.body;

        // MANDA APENAS UM ARRAY COM OS IDS usando um map
        const productsIds = products.map((product) => product.id)

        // buscando todas as informações de cada produto conforme o id passado
        const findProducts = await Product.findAll({
            where: {
                id: productsIds,
            }, 
            // está vindo apenas o id da categoria
            // para vir o nome, precisa transformar
            include: [ // incluir 
                {
                    model: Category, // da model de categoria
                    as: 'category', // chave passada la no método associate, da model de Product
                    attributes: ['name'] // trazendo apenas o nome da categoria
                }
            ]
        })

        // transformando
        const formattedProducts = findProducts.map((product) => {
            // para achar a quantidade
            // eu quero achar o indice do array de products, onde o id que eu passar seja igual
            // ao id de product
            const productIndex = products.findIndex(item => item.id === product.id)

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                url: product.url,
                // products vindo la da request, com o index, pegando a quantidade para mim
                quantity: products[productIndex].quantity
            }
            return newProduct
        })

        const order = {
            // ESTOU PEGANDO AS INFORMAÇÕES DE USUÁRIO ESTÃO VINDO PELO TOKEN
            user: {
                id: request.userId,
                name: request.userName,
            },
            // PEGANDO O ARRAY DE PRODUCTS VINDO DO SCHEMA
            products: formattedProducts,
            status: 'Pedido realizado'
            
        }

        // vai salvar a order dentro do mongoDB
        const createdOrder = await Order.create(order)

        return response.status(201).json(createdOrder)
    }

    // método que vai buscar os pedidos la no mongoDB
    async index(request, response) {
        const orders = await Order.find();
        return response.json(orders)
    }

    // método que vai dar o update no status do pedido

    async update (request, response) {
        const schema = Yup.object({
            // ARRAY DE PRODUTOS COM A QUANTIDADE E O NOME
            // NÃO É SEGURO MOSTRAR O PREÇO E OUTRAS INFORMAÇÕES
            // POIS COM O ID EU CONSIGO SABER QUAL PRODUTO É 
            status: Yup.string().required()
            
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch(err) {
            return response.status(400).json({ error: err.errors});
        }

        // VERIFICAÇÃO SE O USUÁRIO É ADMINISTRADOR
        // vai lá na tabela de usuários e procura pelo chave primaria (id do usuário)
        // o id de usuário vem dentro da request
        // vai retornar todo o objeto de usuário, por isso deve-se desesstruturar para pegar
        // somente o admin
        //  const isAdmin = await User.findByPk(request.userId)
       const { admin: isAdmin } = await User.findByPk(request.userId);
       // verificação, se o usuário não for administrador, ou seja, se for falso     
       if(!isAdmin) {
         return response.status(401).json({ message: 'O usuário não é administrador.' })
       }

        // preciso saber qual pedido que vai sofrer a atualização
       
        const { id } = request.params; // pegando o id e jogando para a rota put
        const { status } = request.body; // pegando o status

        // o try catch já verifica se existe ou não o pedido
       try {
        // vou fazer a atualização em um registro la no mongo 
       // no primeiro parametro vou procurar onde vou fazer o update que é o _id
       // passando onde que vou fazer o update, que é no id 
       // segundo parametro, é o que vou fazer update
        await Order.updateOne({ _id: id }, { status });
       } catch (err) {
            return response.status(400).json({error: err.message})
       }

       return response.json({ message: 'O status foi alterado com sucesso.'})
       
        // verificação se existe esse pedido

    }

    
}

export default new OrderController();