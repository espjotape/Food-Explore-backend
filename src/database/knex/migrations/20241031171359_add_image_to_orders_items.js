exports.up = knex => knex.schema.createTable("ordersItems", table => {
 table.increments("id");
 table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE"); 
 table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE"); 

 table.text("title"); 
 table.integer("quantity"); 
 table.float("price")

 table.timestamp("created_at").default(knex.fn.now()); 
 table.unique(['order_id', 'dish_id']);
});

exports.down = knex => knex.schema.dropTable("ordersItems");
