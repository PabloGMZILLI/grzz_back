exports.up = function (knex) {
    return knex.schema
        .hasTable('answers')
        .then(function (exists) {
            if (!exists) {
              return knex
                    .schema
                    .createTable('answers', function (table) {
                        table.increments('id').notNullable();
                        table.string('answer').notNullable();
                        table.boolean('checked').notNullable();
                    })
                    .then(console.log('Created answers table'));
            }
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('answers');
};
