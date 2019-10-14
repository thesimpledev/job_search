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

  def self.start
    new.run
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

  def run
    system('clear')
    SETTINGS[:positions].shuffle.each do |position|
      SETTINGS[:places].shuffle.each do |location|
        start = Time.now
        pages = 0
        jobs = []

        begin
          Alert.start_search(position, location)
          browser.search(position, location)
          browser.each_page do
            pages += 1
            jobs << parser.parse_jobs
          end
        rescue => e
          scrape = Scrape.create!(
            location: location,
            position: position,
            start: start,
            finish: Time.now,
            pages: pages,
            date_ran: Date.today
          )
          scrape.jobs << jobs.flatten
          puts '-' * 20
          puts 'Done with search or an error occurred.'
          puts e
          puts '-' * 20
        end
      end
    end
  end
end
