class CreateVotes < ActiveRecord::Migration
  def self.up
    create_table :votes do |t|
      t.references :event
      t.references :user
      t.timestamps
    end
  end

  def self.down
    drop_table :votes
  end
end
