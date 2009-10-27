class EventMeta < ActiveRecord::Base
  has_one :event
  # belongs_to :author, :class_name => User
  
  def send_auto_reminder?
    self.auto_reminder_days > 0
  end
  
  def send_auto_reminder=(val)
    self.auto_reminder_days = 1
  end
  
  def cutoff_voting?
    self.voting_cutoff_days > 0
  end
  
  # def cutoff_voting=(val)
  #   self.voting_cutoff_days = 0
  # end
  
  def require_minimum?
    self.minimum_positive_votes > 0
  end
  
  # def require_minimum=(val)
  #   self.minimum_positive_votes = 0
  # end
  
  def closed?
    self.state == 'CLOSED'
  end
  
  def has_map_link?
    self.map_link && self.map_link != ''
  end
  
  def self.day_filter_options    
    [
      ['any day', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'],
      ['a weekday', 'Mon,Tue,Wed,Thu,Fri'],
      ['Mon-Thu', 'Mon,Tue,Wed,Thu'],
      ['Fri/Sat', 'Fri,Sat'],
      ['Sat/Sun', 'Sat,Sun'],
      ['Thu-Sun', 'Thu,Fri,Sat,Sun'],
      ['--------------'],
      ['a Sunday', 'Sun'],
      ['a Monday', 'Mon'],
      ['a Tuesday', 'Tue'],
      ['a Wednesday', 'Wed'],
      ['a Thursday', 'Thu'],
      ['a Friday', 'Fri'],
      ['a Saturday', 'Sat']
    ]
  end
end
