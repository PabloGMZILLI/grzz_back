
exports.up = function(knex) {
    return knex.schema.createTable("quiz", function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.string('to_workspace').notNullable();
        table.string('created_by');
        table.date('last_modify');
        table.string('modify_by');
    });
};
  
exports.down = function(knex) {
return knex.schema.dropTable('quiz');
};
