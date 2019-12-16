require 'selenium-webdriver'
require 'pry'
require 'active_record'
require_relative 'browser'
require_relative 'job'
require_relative 'parser'
require_relative 'scrape'
require_relative 'point_allocation'
require_relative '../../config/settings'
require_relative '../../config/environment'

# pull together objects to perform their individual jobs
# in order to scrape jobs while also using Scrape to keep track of details
class Scraper
  attr_reader :driver, :wait, :browser, :parser

  def self.locations(*locations)
    new.run(nil, locations)
  end

  def self.start(breakpoint = nil)
    new.run(breakpoint)
  end

  def initialize
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-dev-shm-usage')
    @driver = Selenium::WebDriver.for(:chrome, options: options)
    @wait = Selenium::WebDriver::Wait.new(timeout: 10)
    @browser = Browser.new(driver, wait)
    @parser = Parser.new(driver, browser, wait)
  end

  def run(break_at_page = nil, locations = nil)
    system('clear')
    SETTINGS[:positions].shuffle.each do |position|
      (locations || SETTINGS[:places]).shuffle.each do |location|
        start = Time.now
        pages = 0
        jobs = []

        begin
          Alert.start_search(position, location)
          browser.search(position, location)
          browser.each_page do
            pages += 1
            jobs << parser.parse_jobs(location)
            raise 'Breaking' if break_at_page && break_at_page == pages
          end
        rescue => e
          scrape = Scrape.create!(
            location: location,
            position: position,
            start: start,
            finish: Time.now,
            pages: pages,
          )
          scrape.jobs << jobs.flatten
          scrape.jobs.update_all(search_location: location)
          puts '-' * 20
          puts 'Done with search or an error occurred.'
          puts e
          puts '-' * 20
        end # rescue
      end # location loop
    end # position loop
  end
end
