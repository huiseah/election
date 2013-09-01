Election::Application.routes.draw do
root :to => 'pages#home'
get '/about' => 'pages#about', as: "about"
get '/tweets' => 'tweets#showtweets', as: "tweets"
end
