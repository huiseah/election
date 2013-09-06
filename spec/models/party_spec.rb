require 'spec_helper'

describe Party do



  describe '#new' do
    it 'creates an instance of Party' do
      party = Party.new
      expect(party).to be_an_instance_of(Party)
    end
  end


end