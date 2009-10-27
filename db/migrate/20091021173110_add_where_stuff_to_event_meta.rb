class AddWhereStuffToEventMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :map_link, :string
    add_column :event_metas, :where, :string
  end

  def self.down
    remove_column :event_metas, :where
    remove_column :event_metas, :map_link
  end
end
