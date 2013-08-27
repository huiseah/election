class AddCandidatesTable < ActiveRecord::Migration
  def change
    create_table :candidates do |t|
      t.string :name
      t.integer :party_id
      t.boolean :winner, :default => false
      t.text :bio
      t.text :links
      t.timestamps
    end
  end
end




