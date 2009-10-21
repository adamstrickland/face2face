class Event < ActiveRecord::Base
  belongs_to :event_meta
  has_many :comments
  has_many :votes
  has_many :administrators, :class_name => User
  has_many :participants, :class_name => User
end
