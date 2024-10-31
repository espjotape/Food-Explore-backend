const knex = require("../database/knex");

class OrdersController {
    async create(request, response) {
        const { cart, orderStatus, totalPrice } = request.body; // Removido paymentMethod
        const user_id = request.user.id;

        try {
            // Insira o pedido na tabela orders
            const [order_id] = await knex("orders").insert({
                orderStatus,
                totalPrice,
                user_id 
            });

            // Prepare os itens para serem inseridos na tabela ordersItems
            const itemsInsert = [];

            for (const item of cart) {
                // Busque a imagem do prato pela ID
                const dish = await knex("dishes").where({ id: item.id }).first();
                if (dish) {
                    itemsInsert.push({
                        title: dish.title, // Use o título do prato
                        quantity: item.quantity,
                        dish_id: dish.id,
                        order_id,
                        // Remover a linha da imagem, pois não existe na tabela
                        // image: dish.image // Removido porque a tabela não tem essa coluna
                    });
                }
            }

            // Insira os itens na tabela ordersItems
            await knex("ordersItems").insert(itemsInsert);
            return response.status(201).json({ order_id });
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            return response.status(500).json({ error: "Erro ao criar o pedido." });
        }
    }

    async index(request, response) {
        const user_id = request.user.id;

        try {
            const user = await knex("users").where({ id: user_id }).first();
            const ordersQuery = knex("ordersItems")
                .innerJoin("orders", "orders.id", "ordersItems.order_id")
                .innerJoin("dishes", "dishes.id", "ordersItems.dish_id") // Adicionando a junção para obter a imagem
                .select([
                    "orders.id",
                    "orders.user_id",
                    "orders.orderStatus",
                    "orders.totalPrice",
                    "orders.created_at",
                    "dishes.image" // Selecionando a imagem do prato
                ])
                .groupBy("orders.id");

            const orders = user.isAdmin
                ? await ordersQuery
                : await ordersQuery.where({ user_id });

            const ordersItems = await knex("ordersItems");
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: ordersItems.filter(item => item.order_id === order.id)
            }));

            return response.status(200).json(ordersWithItems);
        } catch (error) {
            console.error("Erro ao listar os pedidos:", error);
            return response.status(500).json({ error: "Erro ao listar os pedidos." });
        }
    }

    async update(request, response) {
        const { id, orderStatus } = request.body;

        try {
            await knex("orders").update({ orderStatus }).where({ id });
            return response.status(204).send();
        } catch (error) {
            console.error("Erro ao atualizar o pedido:", error);
            return response.status(500).json({ error: "Erro ao atualizar o pedido." });
        }
    }
}

module.exports = OrdersController;
