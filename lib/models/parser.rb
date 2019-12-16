require_relative 'job'
require_relative 'alert'
require 'pry'

# responsible for pulling data from page to return job postings
class Parser
  attr_reader :browser, :driver, :wait

  # location can come in as '- some city name, STATEINITIALS (extra detail)'
  # or as '- Remote (extra details)'. So we either match words before comma
  # and initials after or just the remote part. If it's already sanitized, it
  # will return itself.
  #
  # example:
  # Parser.sanitize_location('- San Luis Somewhere, CA (extra details here)')
  # => 'San Luis Somewhere, CA'
  #
  # Parser.sanitize_location('- Remote with some extra detail')
  # => 'Remote'
  #
  # Parser.sanitize_location('San Francisco, CA')
  # => 'San Francisco, CA'
  #
  # @param [String] location to sanitize
  # @return [String] sanitized location
  def self.sanitize_location(location)
    location.match(/^[-\s]*(?'location'([\w*\s*]*, \w+)|([\w*]*))/)[:location]
  end

  def initialize(driver, browser, wait)
    @driver = driver
    @browser = browser
    @wait = wait
  end

  def parse_jobs(search_location)
    jobs = []

    job_cards.each_with_index do |job_card, i|
      next if already_saved?(job_card)
      next if prime?(job_card)

      begin
        go_to_card(job_card, i)
        job = parse_job_posting(job_card)
        Alert.job_saved(job)
        job.date_scraped = Date.today
        job.search_location = search_location
        job.save!
        jobs << job
      rescue => e
        puts e
        puts 'Rescue timeout error most likely'
      end
    end

    jobs
  end

  private

  def already_saved?(job_card)
    return nil unless Job.find_by(job_id: job_card.attribute('id'))

    Alert.already_saved
    true
  end

  def go_to_card(job_card, i)
    begin
      browser.scroll_to_card(i)
      job_card.click
    rescue Selenium::WebDriver::Error::ElementClickInterceptedError
      retry
    end

    begin
      wait.until { driver.find_element(id: 'vjs-jobtitle') }
    rescue Selenium::WebDriver::Error::TimeoutError
      Alert.timeout('Timeout occured. Job was most likely opened in a new tab.')
    end
  end

  def prime?(job_card)
    downcased_text = job_card.text.downcase
    return false unless downcased_text =~ /indeed prime/ || downcased_text =~ /seen by indeed/

    Alert.prime
    true
  end

  def job_cards
    driver.find_elements(class: 'jobsearch-SerpJobCard')
  end

  def parse_job_posting(job_card)
    Job.new(pull_data_from_page(job_card))
  end

  def pull_data_from_page(job_card)
    {
      position: driver.find_element(id: 'vjs-jobtitle').text,
      company: driver.find_element(id: 'vjs-cn').text,
      location: Parser.sanitize_location(driver.find_element(id: 'vjs-loc').text),
      description: driver.find_element(id: 'vjs-content').text,
      job_id: job_card.attribute('id'),
      url: job_card.find_element(tag_name: 'a').attribute('href')
    }
  end
end