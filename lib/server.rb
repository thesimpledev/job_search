require_relative '../config/environment'

class Server < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
    set :bind, '0.0.0.0'
    set :port, 4567
    set :logging, true
  end

  helpers Sinatra::Cookies
  set :environment, Sprockets::Environment.new
  use Rack::Deflater

  environment.append_path 'assets/images'
  environment.append_path 'assets/styles'
  environment.append_path 'assets/scripts'

  environment.js_compressor  = Uglifier.new(harmony: true)
  environment.css_compressor = :sassc

  get '/assets/*' do
    env['PATH_INFO'].sub!('/assets', '')
    settings.environment.call(env)
  end

  get '/' do
    @page_title = '- For Software Engineers'
    if params[:reset]
      %i[
        good_keywords
        bad_keywords
        position_exclusions
        passing_points
      ].each do |cookie_key|
        cookies.delete(cookie_key)
      end
    end

    @job_count = Job.count
    @location_with_count = ActiveRecord::Base.connection.execute(
      QueryBuilder.unique_with_count('jobs', 'search_location', 'DESC')
    )
    erb :search
  end

  get '/about' do
    erb :static_layout, layout: :layout do
      erb :about
    end
  end

  get '/contact' do
    erb :static_layout, layout: :layout do
      erb :contact
    end
  end

  get '/scrapes' do
    @scrapes = Scrape.includes(:jobs).all
    erb :scrapes
  end

  get '/jobs' do
    @page_title = "in #{params[:location]}"
    hashed_params = RequestParser.parse_search_params(params)

    cookies[:location] = params[:location]
    cookies[:good_keywords] = params[:good_keywords]
    cookies[:bad_keywords] = params[:bad_keywords]
    cookies[:position_exclusions] = params[:position_exclusions]
    cookies[:passing_points] = params[:passing_points].to_i

    @total_jobs = Job.where(search_location: params[:location]).count

    @jobs = if hashed_params[:position_exclusions].empty?
              Job
            else
              Job.where(*QueryBuilder.not_similar_to('position', hashed_params[:position_exclusions]))
            end.where(search_location: params[:location])

    @jobs.each do |job|
      job.set_point_allocation(
        hashed_params[:good_keywords],
        hashed_params[:bad_keywords],
        params[:passing_points]
      )
    end

    @jobs = @jobs.select { |job| job.passing_score? }
                 .sort { |a, b| b.points <=> a.points }
    erb :job_index
  end

  run! if app_file == $0
end
