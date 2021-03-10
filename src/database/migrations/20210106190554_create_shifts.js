exports.up = function(knex) {
    return knex.schema.createTable("shifts", function (table) {
      table.increments('id');
      table.string('weekday').notNullable();
      table.string('start_time').notNullable();
      table.string('end_time').notNullable();
      table.date('date');
      table.string('user_id').notNullable();
      table.foreign('user_id').references('id').inTable('users');
    });
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('shifts');
};