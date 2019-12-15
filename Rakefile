require_relative 'config/environment'
require_relative 'lib/models/scraper'

desc "Weekly job scrape for Indeed"
task :scrape_indeed do
  puts 'Scraping Indeed'
  Scraper.start
  puts 'Done scraping Indeed'
end

desc "Test scrape (only 1 page)"
task :scrape_test do
  puts 'Scraping for test env'
  Scraper.start(1)
  puts 'Done scraping'
end