class AddStatesTable < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :name
      t.integer :size
      t.timestamps
    end
  end
end
