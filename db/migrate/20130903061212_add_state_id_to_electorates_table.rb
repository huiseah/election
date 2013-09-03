class AddStateIdToElectoratesTable < ActiveRecord::Migration
  def change
    add_column :electorates, :state_id, :integer
  end
end
