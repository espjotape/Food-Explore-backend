const knex = require("../database/knex");

class OrdersController {
  async create(request, response) {
    const { cart } = request.body;
    const user_id = request.user.id;
  
    try {
      // Insere o pedido na tabela 'orders' e retorna o 'order_id' gerado
      const [order_id] = await knex("orders").insert({
        orderStatus: "pending",
        totalPrice: cart[0].price * cart[0].quantity,
        user_id,
      });
  
      // Define o objeto para inserir na tabela 'ordersItems'
      const itemsInsert = {
        title: cart[0].title,
        quantity: cart[0].quantity,
        price: cart[0].price,
        dish_id: cart[0].dish_id, // Certifique-se de usar 'dish_id' aqui
        order_id,
      };
  
      // Insere os itens do pedido na tabela 'ordersItems'
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
          .innerJoin("dishes", "dishes.id", "ordersItems.dish_id")
          .select([
              "orders.id",
              "orders.user_id",
              "orders.orderStatus",
              "orders.totalPrice",
              "orders.created_at",
              "dishes.image", 
              "ordersItems.price",
              "ordersItems.quantity",
              "ordersItems.title"
          ])
          .groupBy("orders.id", "ordersItems.id");

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

  async delete(request, response) {
    const { id } = request.params;

    try {
        await knex("ordersItems").where({ order_id: id }).del();
        await knex("orders").where({ id }).del();

        return response.status(204).send();
    } catch (error) {
        console.error("Erro ao remover pedido:", error);
        return response.status(500).json({ error: "Erro ao remover o pedido." });
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
