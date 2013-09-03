class StatesController < ApplicationController
	def qld 
		@electorates = Electorate.where(:state_id => 20)
	end

	def nsw
		
	end

	def wa
	end

	def act
	end

	def vic
	end

	def nt
	end

	def tas
	end

	def sa
	end

	def can
	end
end