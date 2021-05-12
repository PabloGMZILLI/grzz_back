exports.up = function (knex) {
    return knex.schema
        .hasTable('relation_question_answer')
        .then(function (exists) {
            if (!exists) {
              return knex
                    .schema
                    .createTable('relation_question_answer', function (table) {
                        table.integer('question_id').notNullable();
                        table.integer('answer_id').notNullable();
                        table.foreign('question_id').references('id').on('questions');
                        table.foreign('answer_id').references('id').on('answers');
                    })
                    .then(console.log('created relation_question_answer table'));
            }
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('relation_question_answer');
};
