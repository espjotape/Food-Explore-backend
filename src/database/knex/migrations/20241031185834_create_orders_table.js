exports.up = knex => {
 return knex.schema.createTable("orders", table => {
   table.increments("id");
   table.integer("user_id").references("id").inTable("users").onDelete("CASCADE"); 
   table.text("orderStatus");
   table.text("totalPrice"); 
   table.text("paymentMethod"); 
   table.timestamp("created_at").defaultTo(knex.fn.now()); 
 });
};

exports.down = knex => {
 return knex.schema.dropTable("orders"); 
};
