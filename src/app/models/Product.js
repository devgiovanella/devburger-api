
import Sequelize, { Model }  from "sequelize";

class Product extends Model {
    static init(sequelize) {
        super.init({
            // PASSANDO TODAS PRORPIEDADES QUE A MODEL TEM
            name: Sequelize.STRING,
            price: Sequelize.INTEGER,
            // category: Sequelize.STRING,
            // CRIANDO UM CAMPO VIRTUAL
            path: Sequelize.STRING,
            // CRIANDO UMA URL PARA RETORNAR
            // SALVANDO SÓ O PATH E DEIXANDO A URL DINÂMICA DE ACORDO ONDE O SERVIDOR ESTÁ
            // COM O MÉTODO GET, TODA VEZ QUE EU RECUPERAR UM PRODUTO ELE VAI GERAR O 
            // CAMPO VIRTAL COM A URL
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    return `http://localhost:3001/product-file/${this.path}`
                }
            },
            offer: {
                type: Sequelize.BOOLEAN,
            }

        }, 
        
        {
            sequelize
        });

        return this;
    }

    // assioção do Model de Produto com o Model de Categorias
    static associate (models) {
        // avisando o sequelize que esse model ele pertence ao model de categorias
        // uma categoria pode ter vários produtos
        // nesse caso o produto pertence à categoria
        // por isso o belongsTo
        this.belongsTo(models.Category, {
            // chave estrangeira
            foreignKey: 'category_id',
            // traga as informações da categoria, dentro da propriedade chamada category
            as: 'category',
        })
    }
}

export default Product;