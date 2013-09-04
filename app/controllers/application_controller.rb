class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :authenticate


  private
  def authenticate
    return unless session[:user_id]
    @auth = User.find(session[:user_id])
    unless @auth
      session[:user_id] = nil
      redirect_to(root_path)
    end
  end
end
