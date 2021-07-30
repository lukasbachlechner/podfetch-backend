import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PlayedEpisodes extends BaseSchema {
  protected tableName = 'played_episodes';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('episode_id');
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE');
      table.integer('playback_time');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
