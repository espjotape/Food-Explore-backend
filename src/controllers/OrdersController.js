const knex = require("../database/knex");

class OrdersController {
  async create(request, response) {
    const { cart, orderStatus, totalPrice, paymentMethod } = request.body;
    const user_id = request.user.id;
  
    try {
      const [order_id] = await knex("orders").insert({
        orderStatus,
        totalPrice,
        paymentMethod,
        user_id
      });
  
      // Adiciona a imagem ao itemsInsert
      const itemsInsert = cart.map(item => ({
        title: item.title,
        quantity: item.quantity,
        dish_id: item.id,
        order_id,
        image: item.image // Adicionando a imagem do prato
      }));
  
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
     .select([
      "orders.id",
      "orders.user_id",
      "orders.orderStatus",
      "orders.totalPrice",
      "orders.paymentMethod",
      "orders.created_at",
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
