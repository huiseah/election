class StatesController < ApplicationController

	def qld 
		@qld = State.where(:name => 'QLD').first
		@electorates = Electorate.where(:state_id => @qld.id)
		@parties = Party.where.not(:candidate => 'Labor' || 'Coalition')
	end

	def nsw
		@nsw = State.where(:name => 'NSW').first
		@electorates = Electorate.where(:state_id => @nsw.id)
	end

	def wa
		@wa = State.where(:name => 'WA').first
		@electorates = Electorate.where(:state_id => @wa.id)
	end

	def act
		@act = State.where(:name => 'ACT').first
		@electorates = Electorate.where(:state_id => @act.id)
	end

	def vic
		@vic = State.where(:name => 'VIC').first
		@electorates = Electorate.where(:state_id => @vic.id)
	end

	def nt
		@nt = State.where(:name => 'NT').first
		@electorates = Electorate.where(:state_id => @nt.id)
	end

	def tas
		@tas = State.where(:name => 'TAS').first
		@electorates = Electorate.where(:state_id => @tas.id)
	end

	def sa
		@sa = State.where(:name => 'SA').first
		@electorates = Electorate.where(:state_id => @sa.id)
	end

end