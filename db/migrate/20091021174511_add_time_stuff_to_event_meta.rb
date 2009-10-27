class AddTimeStuffToEventMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :start_time, :time
  end

  def self.down
    remove_column :event_metas, :start_time
  end
end
