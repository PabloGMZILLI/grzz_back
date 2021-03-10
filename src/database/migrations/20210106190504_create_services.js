
exports.up = function(knex) {
    return knex.schema.createTable("services", function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.decimal('price').notNullable();
        table.integer('time').notNullable();
        table.string('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
return knex.schema.dropTable('services');
};
