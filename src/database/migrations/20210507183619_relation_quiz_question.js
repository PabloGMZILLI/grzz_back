exports.up = function (knex) {
    return knex.schema
        .hasTable('relation_quiz_question')
        .then(function (exists) {
            if (!exists) {
              return knex
                    .schema
                    .createTable('relation_quiz_question', function (table) {
                        table.integer('quiz_id').notNullable();
                        table.integer('question_id').notNullable();
                        table.foreign('quiz_id').references('id').on('quiz');
                        table.foreign('question_id').references('id').on('questions');
                    })
                    .then(console.log('created relation_quiz_question table'));
            }
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('relation_quiz_question');
};
