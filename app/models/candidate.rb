# == Schema Information
#
# Table name: candidates
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  party_id   :integer
#  winner     :boolean          default(FALSE)
#  bio        :text
#  links      :text
#  created_at :datetime
#  updated_at :datetime
#

class Candidate < ActiveRecord::Base

end
