require 'spec_helper'

describe State do

  describe '#new' do
    it 'creates an instance of state' do
      state = State.new
      expect(state).to be_an_instance_of(State)
    end
  end

  describe '.electorate' do
    it 'has many electorates' do
      electorate = Electorate.new
      state = State.new
      state.electorates << electorate
      expect(state.electorates).to_not be nil
    end
  end

end
