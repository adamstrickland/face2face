# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_face2face_session',
  :secret      => 'f1d888f4d695c0d7818e481aca8267b9eabbf88cae958166127145a6c40f68e0acf222140a560816e9a3d93e78a4616aadd3a50df5ca5074227e71793f534cad'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
