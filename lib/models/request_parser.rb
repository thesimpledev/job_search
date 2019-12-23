class RequestParser
  class << self
    def parse_search_params(params)
      {
        good_keywords: JSON.parse(params[:good_keywords]),
        bad_keywords: JSON.parse(params[:bad_keywords]),
        position_exclusions: params[:position_exclusions].split(',')
      }
    end
  end
end