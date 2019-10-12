require 'active_record'
require 'colorize'
require_relative 'point_allocation'

class Job < ActiveRecord::Base
  attr_reader :point_allocation
  delegate :points, :passing_score?, :good_matches, :bad_matches, to: :point_allocation, allow_nil: true
  validates :company, :description, :job_id, :location, :position, :url, presence: true

  def self.matches
    all.select(&:passing_score?)
  end

  def set_point_allocation(good_keywords, bad_keywords, passing_score)
    @point_allocation = PointAllocation.new(description, good_keywords, bad_keywords, passing_score)
  end
end