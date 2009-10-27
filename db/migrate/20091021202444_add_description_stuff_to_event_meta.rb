class AddDescriptionStuffToEventMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :description, :text
  end

  def self.down
    remove_column :event_metas, :description
  end
end
