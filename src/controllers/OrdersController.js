const knex = require("../database/knex");

class OrdersController {
  async create(request, response) {
    try {
      const { cart, orderStatus, totalPrice, paymentMethod } = request.body;
      const user_id = request.user.id;

      if (!cart || cart.length === 0) {
        return response.status(400).json({ error: "Carrinho vazio ou inválido." });
      }

      // Inserting Order infos into the database
      const [order_id] = await knex("orders").insert({
        orderStatus,
        totalPrice,
        paymentMethod,
        user_id
      });

      // Inserting Items infos into the database
      const itemsInsert = cart.map((item) => {
        return {
          title: item.title,
          quantity: item.quantity,
          dish_id: item.dish_id,
          price: item.price,
          order_id
        }
      });

      await knex("ordersItems").insert(itemsInsert);

      return response.status(201).json({ order_id });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return response.status(500).json({ error: "Erro ao criar pedido." });
    }
  }

  async index(request, response) {
    try {
      const user_id = request.user.id;

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

      const user = await knex("users").where({ id: user_id }).first();

      const orders = user.isAdmin
        ? await ordersQuery
        : await ordersQuery.where({ user_id });

      const ordersItems = await knex("ordersItems");
      const ordersWithItems = orders.map((order) => ({
        ...order,
        items: ordersItems.filter((item) => item.order_id === order.id)
      }));

      return response.status(200).json(ordersWithItems);
    } catch (error) {
      console.error("Erro ao listar os pedidos:", error);
      return response.status(500).json({ error: "Erro ao listar os pedidos." });
    }
  }

  async update(request, response) {
    try {
      const { id, orderStatus } = request.body;

      // Validação de dados
      if (!id || !orderStatus) {
        return response.status(400).json({ error: "Dados incompletos." });
      }

      const validStatuses = [
        "🔴 Pendente",
        "🟡 Em Preparação",
        "🟢 Pronto para Entrega",
        "🟣 Em Trânsito",
        "🟠 Concluído",
        "⚪ Cancelado"
      ];

      if (!validStatuses.includes(orderStatus)) {
        return response.status(400).json({ error: "Status de pedido inválido." });
      }

      // Atualiza o status do pedido
      await knex("orders").update({ orderStatus }).where({ id });

      return response.status(204).send();
    } catch (error) {
      console.error("Erro ao atualizar o pedido:", error);
      return response.status(500).json({ error: "Erro ao atualizar o pedido." });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      // Validação de dados
      if (!id) {
        return response.status(400).json({ error: "ID do pedido é obrigatório." });
      }

      await knex("ordersItems").where({ order_id: id }).del();
      await knex("orders").where({ id }).del();

      return response.status(204).send();
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      return response.status(500).json({ error: "Erro ao remover o pedido." });
    }
  }
}

module.exports = OrdersController;