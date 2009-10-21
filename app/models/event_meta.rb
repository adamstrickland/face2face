class EventMeta < ActiveRecord::Base
  has_one :event
  belongs_to :author, :class_name => User
  
  def send_auto_reminder?
    self.auto_reminder_days > 0
  end
  
  def send_auto_reminder=(val)
    self.auto_reminder_days = 0
  end
  
  def cutoff_voting
    self.voting_cutoff_days > 0
  end
  
  def cutoff_voting=(val)
    self.voting_cutoff_days = 0
  end
  
  def require_minimum?
    self.minimum_positive_votes > 0
  end
  
  def require_minimum=(val)
    self.minimum_positive_votes = 0
  end
  
  def closed?
    self.state == 'CLOSED'
  end
end
