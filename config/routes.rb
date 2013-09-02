Election::Application.routes.draw do
root :to => 'pages#home'
get '/about' => 'pages#about', as: "about"
get '/tweets' => 'tweets#showtweets', as: "tweets"
get '/qld' => 'states#qld', as: "qld"
get '/nt' => 'states#nt', as: "nt"
get '/can' => 'states#can', as: "can"
get '/wa' => 'states#wa', as: "wa"
get '/vic' => 'states#vic', as: "vic"
get '/act' => 'states#act', as: "act"
get '/tas' => 'states#tas', as: "tas"
get '/sa' => 'states#sa', as: "sa"
end
