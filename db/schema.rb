# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091021202444) do

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "event_metas", :force => true do |t|
    t.string   "what",                                      :null => false
    t.string   "author",                                    :null => false
    t.integer  "auto_reminder_days",     :default => 0
    t.boolean  "allow_forwarding",       :default => false
    t.integer  "minimum_positive_votes", :default => 2
    t.integer  "voting_cutoff_days",     :default => 2
    t.boolean  "organizer_required",     :default => true
    t.boolean  "allow_comments",         :default => true
    t.string   "state",                  :default => "NEW"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "when"
    t.string   "day_filter"
    t.string   "date_range"
    t.string   "map_link"
    t.string   "where"
    t.string   "who"
    t.time     "start_time"
    t.time     "author_name"
    t.text     "description"
  end

  create_table "events", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                     :limit => 40
    t.string   "name",                      :limit => 100, :default => ""
    t.string   "email",                     :limit => 100
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",            :limit => 40
    t.datetime "remember_token_expires_at"
    t.string   "activation_code",           :limit => 40
    t.datetime "activated_at"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

  create_table "votes", :force => true do |t|
    t.integer  "event_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
