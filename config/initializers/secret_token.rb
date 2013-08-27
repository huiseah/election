# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Election::Application.config.secret_key_base = '03b9db772434edc2be0f440f369259e763a651f8245d192c292fd129a9796596fd5790c7dd4e7e91c98e76fa5211fd160f97599db323f6d02cac0dd934a0304a'
