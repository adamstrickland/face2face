class EventMeta < ActiveRecord::Base
  has_one :event
  belongs_to :author, :class_name => User
end
