
exports.up = function(knex) {
  return knex.schema.createTable("users", function (table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('password_hash').notNullable();
    table.string('password_salt').notNullable();
    table.string('phone').notNullable();
    table.string('workspace');
    table.string('email');
    table.date('birthday');
    table.float('points');
    table.string('account_type').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
