require 'sinatra'
require 'sinatra/reloader'
require_relative 'models/job'
require_relative 'models/scrape'
require_relative 'helpers/job_helper'
require_relative 'models/request_parser.rb'
require_relative 'models/query_builder'
require_relative '../config/environment'

class Server < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
    set :bind, '0.0.0.0'
    set :port, 4567
  end

  get '/' do
    @job_count = Job.count
    erb :search
  end

  get '/scrapes' do
    @scrapes = Scrape.includes(:jobs).all
    erb :scrapes
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
                 .sort { |a, b| b.points <=> a.points }
    erb :job_index
  end

  run! if app_file == $0
end
