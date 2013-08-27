# == Schema Information
#
# Table name: electorates
#
#  id                 :integer          not null, primary key
#  name               :string(255)
#  size               :integer
#  history            :text
#  sitting_mp         :string(255)
#  polls              :integer
#  tertiary_education :integer
#  median_income      :integer
#  candidate_id       :integer
#  created_at         :datetime
#  updated_at         :datetime
#

class Electorate < ActiveRecord::Base

end
