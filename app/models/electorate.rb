# == Schema Information
#
# Table name: electorates
#
#  id                 :integer          not null, primary key
#  name               :string(255)
#  size               :integer
#  history            :text
#  sitting_mp         :string(255)
#  tertiary_education :integer
#  median_income      :integer
#  candidate_id       :integer
#  created_at         :datetime
#  updated_at         :datetime
#  state_id           :integer
#

class Electorate < ActiveRecord::Base
  attr_accessible :name, :size, :history, :sitting_mp, :state_id
    belongs_to :state, :inverse_of => :electorates
    has_many :parties

    validates :name, :presence => true

  def offer_won?
    self.parties.where(:winner => true).count == 1
  end
end
