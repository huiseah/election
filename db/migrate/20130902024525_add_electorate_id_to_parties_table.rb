class AddElectorateIdToPartiesTable < ActiveRecord::Migration
  def change
    add_column :parties, :electorate_id, :integer
  end
end
