require 'active_record'

raise 'APP_ENV not set' unless ENV['APP_ENV']

if ENV['APP_ENV'] == 'development'
  ActiveRecord::Base.establish_connection(
    adapter: 'postgresql',
    database: 'better_jobs'
  )
else
  database_params = URI.parse(ENV['DATABASE_URL'])
  ActiveRecord::Base.establish_connection(
    adapter: database_params.scheme,
    host: database_params.host,
    username: database_params.user,
    password: database_params.password,
    database: database_params.path[1..-1],
    encoding: 'utf8'
  )
end