# gems
require 'active_record'
require 'sassc'
require 'sinatra'
require 'sinatra/reloader'
require 'sprockets'
require 'pry'
require 'uglifier'

# app
Dir["lib/**/*.rb"].each { |f| require_relative "../#{f}" }

if ENV['RACK_ENV'] != 'production'
  ActiveRecord::Base.establish_connection(
    adapter: 'postgresql',
    database: 'better_jobs'
  )
else
  database_params = URI.parse(ENV['DATABASE_URL'])
  ActiveRecord::Base.establish_connection(
    adapter: database_params.scheme == 'postgres' ? 'postgresql' : db.scheme,
    host: database_params.host,
    username: database_params.user,
    password: database_params.password,
    database: database_params.path[1..-1],
    encoding: 'utf8'
  )
end