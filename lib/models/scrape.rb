require 'active_record'
require_relative '../../lib/models/job'

class Scrape < ActiveRecord::Base
  has_many :jobs
  validate :start_before_finish
  validates :finish,   # when the scrape finished
            :location, # what location was search
            :position, # what position was searched
            :start,    # when the scrape begin
            :pages,    # amount of pages traversed
            :date_ran, # when the scrape was ran
            presence: true

  def duration
    finish - start
  end

  def time_per_job
    duration / jobs.count
  end

  private

  def start_before_finish
    if (!start || !finish) || (start > finish)
      errors.add(:start, 'must be before finish')
    end
  end
end