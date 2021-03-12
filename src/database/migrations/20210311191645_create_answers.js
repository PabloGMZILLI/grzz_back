exports.up = function (knex) {
    return knex.schema
        .hasTable('answers')
        .then(function (exists) {
            if (!exists) {
              return knex
                    .schema
                    .createTable('answers', function (table) {
                        table.integer('id').notNullable();
                        table.integer('quiz_id').notNullable();
                        table.integer('question_id').notNullable();
                        table.string('user_id').notNullable();
                        table.boolean('correct').notNullable();
                        table.string('answer_selected').notNullable();
                        table.date('date').notNullable();
                        table.foreign('quiz_id').references('id').on('quiz');
                        table.foreign('question_id').references('id').on('questions');
                        table.foreign('user_id').references('id').on('user');
                    })
                    .then(console.log('Created answers table'));
            }
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('answers');
};
