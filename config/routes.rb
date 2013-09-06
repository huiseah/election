Election::Application.routes.draw do
  root :to => 'pages#home'
  resources :electorates, :only => [:index, :new, :create]

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


  get '/login' => 'session#new'
  post 'login' => 'session#create'
  get '/logout' => 'session#destroy'
end
