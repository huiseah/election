Election::Application.routes.draw do
root :to => 'pages#home'
get '/about' => 'pages#about', as: "about"

end
