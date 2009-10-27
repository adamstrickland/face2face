class AddInviteeStuffToEventMeta < ActiveRecord::Migration
  def self.up
    add_column :event_metas, :who, :string
  end

  def self.down
    remove_column :event_metas, :who
  end
end
