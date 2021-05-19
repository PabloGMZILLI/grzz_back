
exports.up = function(knex) {
    return knex.schema
    .hasTable('user_answered')
    .then(function (exists) {
        if (!exists) {
          return knex
                .schema
                .createTable('user_answered', function (table) {
                    table.string('user_id').notNullable();
                    table.integer('quiz_id').notNullable();
                    table.integer('question_id').notNullable();
                    table.string('answer_checked_id').notNullable();
                    table.float('points').notNullable();
                    table.integer('timespent').notNullable();
                    table.string('datetime').notNullable();

                    table.foreign('user_id').references('id').on('users');
                    table.foreign('quiz_id').references('id').on('quiz');
                    table.foreign('question_id').references('id').on('questions');
                })
                .then(console.log('Created user_answered table'));
        } else {
            console.log('Tabela user_answered já existe!');
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_answered');
};
