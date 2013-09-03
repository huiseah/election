class AddPartiesTable < ActiveRecord::Migration
  def change
    create_table :parties do |t|
      t.string :name
      t.string :candidate
      t.float :polls
      t.text :bio
      t.boolean :winner, :default => false
      t.text :links
      t.timestamps
    end
  end
end


#   - Electorates 
#   - size
#   - number of candidates
#   - history
#   - current mp
#   - polls
#   - has many candidates
#   - median income
#   - education
# - Candidates
#   - party
#   - winner yes/no
#   - short bio
#   - links to twitter/website
# - Parties
#   - has many candidates
#   - party bio/latest tweets
#   - link to website

# Filter via post code

# Red/blue/green/grey colour scheme
# TO DO:
# - Map out Guardian/ABC site
# @rdrakey
