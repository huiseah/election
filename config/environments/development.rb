Election::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Twitter.configure do |config|
  # config.consumer_key = YOUR_CONSUMER_KEY | fMc2vinM12bosAV43lFaww
  # config.consumer_secret = YOUR_CONSUMER_SECRET | 39L5cRh6kImtAkZx8paW6DdQNa8HlJLK02fHBs6w
  # config.oauth_token = YOUR_OAUTH_TOKEN | 48602096-lmxlbZlBvrKQKYBh4xHXg5N1uQFLh113VZBswNrtI
  # config.oauth_token_secret = YOUR_OAUTH_TOKEN_SECRET | E81tF4ELC9593UBofYHnc8je5M1tj4L4Ej43EtIrro
end
