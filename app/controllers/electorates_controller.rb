class ElectoratesController < ApplicationController
  before_filter :check_if_admin, :only => [:new, :create]

  def new
      @electorate = Electorate.new
    end

  def create
    electorate = Electorate.create(params[:electorate])
    #state_id = State.id.where(params[:name].upcase)
  end

private
  def check_if_admin
    redirect_to(root_path) if @auth.nil? || !@auth.is_admin?
  end
end