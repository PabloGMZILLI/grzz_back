exports.up = function(knex) {
    return knex.schema.createTable("schedules", function (table) {
      table.increments('id');
      table.date('date').notNullable();
      table.string('time').notNullable();
      table.string('service_id').notNullable();
      table.string('created_from').notNullable();
      table.string('service_to_id').notNullable();
      table.string('status').notNullable();

      table.foreign('service_id').references('id').inTable('services');
      table.foreign('created_from').references('id').inTable('users');
      table.foreign('service_to_id').references('id').inTable('users');
    });
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('schedules');
};
