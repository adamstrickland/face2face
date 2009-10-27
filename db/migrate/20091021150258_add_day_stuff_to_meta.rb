class AddDayStuffToMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :when, :string
    add_column :event_metas, :day_filter, :string
    add_column :event_metas, :date_range, :string
  end

  def self.down
    remove_column :event_metas, :date_range
    remove_column :event_metas, :day_filter
    remove_column :event_metas, :when
  end
end
