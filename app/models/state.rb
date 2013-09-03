# == Schema Information
#
# Table name: states
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  size       :integer
#  created_at :datetime
#  updated_at :datetime
#

class State < ActiveRecord::Base
  attr_accessible :name, :size
  has_many :electorates, :inverse_of => :state


  validates :name, :presence => true
end
