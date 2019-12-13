require_relative 'config/environment'
require_relative 'lib/models/scraper'

desc "Weekly job scrape for Indeed"
task :scrape_indeed do
  puts 'Scraping Indeed'
  Scraper.start
  puts 'Done scraping Indeed'
end