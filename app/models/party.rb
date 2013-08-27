# == Schema Information
#
# Table name: parties
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  bio        :text
#  polls      :integer
#  winner     :boolean          default(FALSE)
#  links      :text
#  created_at :datetime
#  updated_at :datetime
#

class Party < ActiveRecord::Base

end
