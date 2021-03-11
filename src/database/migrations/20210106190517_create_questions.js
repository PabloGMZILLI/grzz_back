
exports.up = function(knex) {
    return knex.schema.createTable("questions", function (table) {
        table.increments('id');
        table.string('question').notNullable();
        table.float('points').notNullable();
        table.integer('max_time').notNullable();
        table.string('correct_answer').notNullable();
        table.string('wrong_answers').notNullable();
    });
};
  
exports.down = function(knex) {
return knex.schema.dropTable('questions');
};
