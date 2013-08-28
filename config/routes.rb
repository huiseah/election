Election::Application.routes.draw do
root :to => 'pages#index'
get '/about' => 'pages#about', as: "about"

end
