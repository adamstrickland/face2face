class CreateEventMetas < ActiveRecord::Migration
  def self.up
    create_table :event_metas do |t|
      t.string :title
      t.references :user

      t.timestamps
    end
  end

  def self.down
    drop_table :event_metas
  end
end
