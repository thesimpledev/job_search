require 'selenium-webdriver'
require 'pry'
require 'active_record'
require_relative 'browser'
require_relative 'job'
require_relative 'parser'
require_relative 'point_allocation'
require_relative '../../config/settings'
require_relative '../../config/environment'

# pull together objects to perform their individual jobs
# in order to scrape jobs
class Scraper
  attr_reader :driver, :wait, :browser, :parser

  def self.start
    new.run
  end

  def initialize
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    options.add_argument('--window-size=1920,1080')
    @driver = Selenium::WebDriver.for(:chrome, options: options)
    @wait = Selenium::WebDriver::Wait.new(timeout: 10)
    @browser = Browser.new(driver, wait)
    @parser = Parser.new(driver, browser, wait)
  end

  def run
    system('clear')
    SETTINGS[:places].shuffle.each do |location|
      SETTINGS[:positions].shuffle.each do |position|
        begin
          Alert.start_search(position, location)
          browser.search(position, location)
          browser.each_page do
            parser.parse_jobs
          end
        rescue => e
          puts '-' * 20
          puts 'Done with search or an error occurred.'
          puts e
          puts '-' * 20
        end
      end
    end
  end
end
