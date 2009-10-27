class AddNameStuffToEventMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :author_name, :time
  end

  def self.down
    remove_column :event_metas, :author_name
  end
end
