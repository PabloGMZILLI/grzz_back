exports.up = function (knex) {
    return knex.schema
        .hasTable('relationqq')
        .then(function (exists) {
            if (!exists) {
              return knex
                    .schema
                    .createTable('relationqq', function (table) {
                        table.integer('quiz_id').notNullable();
                        table.integer('question_id').notNullable();
                        table.string('author');
                        table.foreign('quiz_id').references('id').on('quiz');
                        table.foreign('question_id').references('id').on('questions');
                    })
                    .then(console.log('created relationqq table'));
            }
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('relationqq');
};
