require 'spec_helper'

describe Electorate do

  describe '#new' do
    it 'creates an instance of electorate' do
      electorate = Electorate.new
      expect(electorate).to be_an_instance_of(Electorate)
    end
  end

  describe '.party' do
    it 'has many parties' do
      party = Party.new
      electorate = Electorate.new
      electorate.parties << party
      expect(electorate.parties).to_not be nil
    end
  end

end
