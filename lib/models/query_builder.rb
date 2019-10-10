class QueryBuilder
  # builds a query string to exclude many words
  #
  # example usage:
  # query_string = QueryBuilder.exclude_all('jobs', 'position', ['senior', 'lead'])
  # Job.where(query_string)
  #
  # @param [String] table_name to exclude from
  # @param [String] column_name to exclude from
  # @param [Array<String>] words to exclude
  def self.exclude_all(table_name, column_name, words)
    output = []
    words.each do |word|
      output << "#{column_name} LIKE '%#{word}%'"
    end
    "SELECT * FROM #{table_name} WHERE NOT (#{output.join(' OR ')})"
  end
end