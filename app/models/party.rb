# == Schema Information
#
# Table name: parties
#
#  id            :integer          not null, primary key
#  name          :string(255)
#  candidate     :string(255)
#  polls         :float
#  bio           :text
#  winner        :boolean          default(FALSE)
#  links         :text
#  created_at    :datetime
#  updated_at    :datetime
#  electorate_id :integer
#

class Party < ActiveRecord::Base
  attr_accessible :name, :bio, :winner, :electorate_id, :candidate, :polls, :links


    validates :name, :presence => true
    validates_uniqueness_of :winner, :scope => :electorate_id, :conditions => lambda { where(:winner => true) }

end
