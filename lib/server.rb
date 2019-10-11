require 'active_record'
require 'sinatra/base'
require 'sinatra/json'
require_relative 'models/job'
require_relative './helpers/job_helper'
require_relative './models/request_parser.rb'
require_relative '../lib/models/query_builder'
require 'pry'

ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: './job_search.db'
)

class Server < Sinatra::Base
  # TODO: set only for dev enviroment
  set :bind, '0.0.0.0'
  set :port, 1234

  get '/' do
    erb :search
  end

  get '/jobs' do
    @jobs = Job.all
    erb :job_index
  end

  post '/jobs' do
    hashed_params = RequestParser.parse_search_params(params)
    query = QueryBuilder.exclude_all(
      'jobs',
      'position',
      hashed_params[:position_exclusions]
    )
    @jobs = Job.find_by_sql(query)

    @jobs.each do |job|
      job.set_point_allocation(
        hashed_params[:good_keywords],
        hashed_params[:bad_keywords],
        params['passing_points'].to_i
      )
    end

    @jobs = @jobs.select { |job| job.passing_score? }
    erb :job_index
  end

  run! if app_file == $0
end
