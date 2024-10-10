exports.up = knex => knex.schema.createTable("dishes", table => {
 table.increments("id");
 table.integer("user_id").references("id").inTable("users");
 table.text("title");
 table.text("description");
 table.text("category");
 table.text("price");
 table.varchar("image");
});

exports.down = knex => knex.schema.dropTable("dishes");