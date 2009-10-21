class CreateEventMetas < ActiveRecord::Migration
  def self.up
    create_table :event_metas do |t|
      t.string :title, :null => false
      t.references :user, :null => false
      t.integer :auto_reminder_days, :default => 0
      t.boolean :alllow_forwarding, :default => false
      t.integer :minimum_positive_votes, :default => 2
      t.integer :voting_cutoff_days, :default => 2
      t.boolean :organizer_required, :default => true
      t.boolean :allow_comments, :default => true
      t.string :state, :default => 'NEW'

      t.timestamps
    end
  end

  def self.down
    drop_table :event_metas
  end
end
