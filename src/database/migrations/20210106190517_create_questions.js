
exports.up = function(knex) {
    return knex.schema.createTable("questions", function (table) {
        table.increments('id');
        table.string('question').notNullable();
        table.float('points').notNullable();
        table.integer('max_time').notNullable();
        table.integer('correct_answer_id').notNullable();
    });
};
  
exports.down = function(knex) {
return knex.schema.dropTable('questions');
};
