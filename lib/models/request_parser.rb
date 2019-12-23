class RequestParser
  class << self
    def parse_search_params(params)
      {
        good_keywords: JSON.parse(params[:good_keywords]),
        bad_keywords: JSON.parse(params[:bad_keywords]),
        position_exclusions: parse_position_exclusions(params[:position_exclusions])
      }
    end

    private

    def parse_position_exclusions(position_exclusions)
      position_exclusions.split("\r\n")
    end
  end
end