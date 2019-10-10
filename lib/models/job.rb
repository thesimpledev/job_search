require 'active_record'
require 'colorize'
require_relative 'point_allocation'

class Job < ActiveRecord::Base
  VALID_STATUSES = %w(needs_review applied bad_match dont_want interested response)

  attr_reader :point_allocation
  delegate :points, :passing_score?, :good_matches, :bad_matches, to: :point_allocation, allow_nil: true
  enum status: VALID_STATUSES
  scope :reviewable, -> { where.not(status: :bad_match).where.not(status: :dont_want) }
  validates :company, :description, :job_id, :location, :position, :status,
            :url, presence: true
  validates :status, inclusion: { in: VALID_STATUSES }

  def self.matches
    all.select(&:passing_score?)
  end

  def review_status_pretty
    color = if bad_match?
              :red
            elsif applied?
              :green
            elsif needs_review?
              :yellow
            elsif interested?
              :light_blue
            elsif dont_want?
              :red
            elsif response?
              :green
            else
              ''
            end

    status.to_s.send(color)
  end

  def to_s
    puts "#{position} @ #{company}".colorize(background: :green, color: :black)

    puts '> Description'.colorize(background: :white, color: :black)
    puts description
  end

  def set_point_allocation(good_keywords, bad_keywords, passing_score)
    @point_allocation = PointAllocation.new(description, good_keywords, bad_keywords, passing_score)
  end
end