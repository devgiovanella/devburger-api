// UM SCHEMA É MUITO PARECIDO COM UMA MODEL

// IMPORTAR O MONGOOSE
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // AGORA VAI O FORMATO DO SCHEMA
    
    
    user: { // INICIO OBJETO USER
        id: {
            type: String,
            required: true, // VAI SER OBRIGATÓRIO
        },
        name: {
            type: String,
            required: true,
        }
    }, // FIM OBJETO USER

    products: [ // INICIO DO ARRAY DE PRODUTOS, POIS PODEM SER VÁRIOS 
        
        { // INÍCIO DO OBJETO DE PRODUTOS

            id: {
                type: Number,
                required: true,
            },

            name: {
                type: String,
                required: true,
            },

            price: {
                type: Number,
                required: true,
            },

            category: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }, // FIM DO OBJETO DE PRODUTOS
    ], // FIM DO ARRAY DE PRODUTOS

    status: {
        type: String,
        required: true,
    }
}, 
{
    timestamps: true // AQUI É A MESMA COISA QUE O CREATED_AT E O UPDATED_AT
},
);

export default mongoose.model('Order', orderSchema);

