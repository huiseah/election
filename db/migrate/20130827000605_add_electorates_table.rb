class AddElectoratesTable < ActiveRecord::Migration
  def change
    create_table :electorates do |t|
      t.string :name
      t.integer :size
      t.text :history
      t.string :sitting_mp
      t.integer :tertiary_education
      t.integer :median_income
      t.integer :candidate_id
      t.timestamps
    end
  end
end
  


