require_relative '../config/environment'
require_relative '../lib/models/job'
require_relative '../lib/models/scrape'
require_relative '../config/settings'
require 'pry'

ActiveRecord::Base.transaction do
  Job.destroy_all
  Scrape.destroy_all

  SETTINGS[:places].each do |search_location|
    jobs = []

    rand(1..100).times do |i|
      jobs << Job.create!(
        company: "Company#{i}",
        description: "something",
        job_id: i,
        location: "Some Location#{i}",
        search_location: search_location,
        position: "Position#{i}",
        url: "Url#{i}",
        date_scraped: Date.today
      )
    end

    scrape = Scrape.new(
      start: Time.now - 10,
      finish: Time.now,
      pages: 1,
      location: 'Something',
      position: 'Something'
    )
    scrape.save(validate: false)
    scrape.jobs << jobs
  end
end