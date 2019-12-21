# Accumulated points from good and bad keywords matched from text
#
class PointAllocation
  attr_reader :points,       # [Integer] accumulated points
              :good_matches, # [Array<String>] good key words that were matched
              :bad_matches,  # [Array<String>] bad key words that were matched
              :passing_score # [Integer] score needed to pass

  # Initialize and keep track of points, good_matches, bad matches, and passing
  # score while allocate points and parsing text to find matches
  #
  # @param [String] text to be parsed
  # @param [Hash] good_keywords with String as key and positive points as value
  # @param [Hash] bad_keywords with String as key and negative points as value
  # @param [Integer] passing_score is the amount of points needed to pass
  #
  def initialize(text = '', good_keywords = {}, bad_keywords = {}, passing_score = 0)
    self.points = 0
    self.bad_matches = []
    self.good_matches = []
    self.passing_score = passing_score.to_i
    self.words_found = text
    allocate_good_matches(good_keywords)
    allocate_bad_matches(bad_keywords)
  end

  # @return [Boolean] whether it passed or not
  #
  def passing_score?
    points >= passing_score
  end

  private

  attr_reader :words_found
  attr_writer :bad_matches, :good_matches, :passing_score, :points

  def allocate_good_matches(good_keywords)
    match(good_keywords, :good_matches)
  end

  def allocate_bad_matches(bad_keywords)
    match(bad_keywords, :bad_matches)
  end

  def match(keywords, attribute)
    keywords.each do |word, value|
      if words_found[word]
        self.points += value.to_i
        send(attribute) << word
      end
    end
  end

  def words_found=(text)
    @words_found = {}
    text.downcase.split(' ').each { |word| @words_found[word] = true }
  end
end
