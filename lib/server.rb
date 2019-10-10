require 'active_record'
require 'sinatra/base'
require 'sinatra/json'
require 'sinatra/namespace'
require_relative 'models/job'
require_relative './helpers/job_helper'
require_relative './models/request_parser.rb'
require 'pry'

ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: './job_search.db'
)

def multiple_exclusions(position_exclusions)
  sql_query = []
  position_exclusions.split("\r\n").each do |position|
    sql_query << "position NOT LIKE '%#{position}%'"
  end
  sql_query.join(' OR ')
end

class Server < Sinatra::Base
  register Sinatra::Namespace

  get '/' do
    erb :search
  end

  get '/jobs' do
    @jobs = Job.all
    erb :job_index
  end

  post '/jobs' do
    hashed_params = RequestParser.parse_search_params(params)
    @jobs = Job.all
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
