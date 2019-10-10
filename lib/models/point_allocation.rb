# accumulated points from good and bad keywords matched from text
class PointAllocation
  attr_reader :points,       # [Integer] accumulated points
              :good_matches, # [Array<String>] good key words that were matched
              :bad_matches,  # [Array<String>] bad key words that were matched
              :passing_score # [Integer] score needed to pass


  # initialize and keep track of points, good_matches, bad matches, and passing
  # score while allocate points and parsing text to find matches
  # @param [String] text to be parsed
  # @param [Hash] good_keywords with String as key and positive points as value
  # @param [Hash] bad_keywords with String as key and negative points as value
  # @param [Integer] passing_score is the amount of points needed to pass
  def initialize(text = '', good_keywords = {}, bad_keywords = {}, passing_score = 0) # TODO: change to options
    @points = 0
    @bad_matches = []
    @good_matches = []
    @passing_score = passing_score
    text = text.downcase
    allocate_good_matches(text, good_keywords)
    allocate_bad_matches(text, bad_keywords)
  end

  # @return [Boolean] whether it passed or not
  def passing_score?
    points >= passing_score
  end

  private

  attr_writer :points

  def allocate_good_matches(text, good_keywords)
    match(good_keywords, text, :good_matches)
  end

  def allocate_bad_matches(text, bad_keywords)
    match(bad_keywords, text, :bad_matches)
  end

  def match(keywords, text, attribute)
    keywords.each do |word, value|
      if text.split(' ').include?(word)
        self.points += value.to_i
        send(attribute) << word
      end
    end
  end
end