class RequestParser
  class << self
    def parse_search_params(params)
      {
        good_keywords: parse_good_keywords(params['good_keywords']),
        bad_keywords: parse_bad_keywords(params['bad_keywords']),
        position_exclusions: parse_position_exclusions(params['position_exclusions'])
      }
    end

    private

    def parse_passing_points(passing_points)
      passing_points.to_i
    end

    def parse_good_keywords(good_keywords)
      Hash[*good_keywords.split("\r\n").map { |el| el.split(/\s(\w+)$/) }.flatten]
    end

    def parse_bad_keywords(bad_keywords)
      Hash[*bad_keywords.split("\r\n").map { |el| el.split(/\s(-\w+)$/) }.flatten]
    end

    def parse_position_exclusions(position_exclusions)
      position_exclusions.split("\r\n")
    end
  end
end