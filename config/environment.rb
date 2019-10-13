require 'active_record'

if !ENV['APP_ENV'] # development
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