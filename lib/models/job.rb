require 'active_record'
require 'colorize'
require_relative 'point_allocation'
require_relative '../../config/settings'

class Job < ActiveRecord::Base
  after_initialize :set_date_scraped_to_today
  attr_reader :point_allocation
  belongs_to :scrape
  delegate :points,
           :passing_score?,
           :good_matches,
           :bad_matches,
           to: :point_allocation,
           allow_nil: true
  validates :company,
            :date_scraped,
            :description,
            :job_id,
            :location,
            :position,
            :url,
            :search_location,
            presence: true
  validates :search_location, inclusion: { in: SETTINGS[:places] }

  def self.matches
    all.select(&:passing_score?)
  end

  def set_point_allocation(good_keywords, bad_keywords, passing_score)
    @point_allocation = PointAllocation.new(description, good_keywords, bad_keywords, passing_score)
  end

  private

  def set_date_scraped_to_today
    self.date_scraped ||= Date.today
  end
end