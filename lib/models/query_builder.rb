class QueryBuilder
  attr_reader :select, :table, :where_conditions

  def self.unique_with_count(table, column, order = "ASC")
    <<-SQL
      SELECT DISTINCT(#{column}), COUNT(#{column})
      FROM #{table}
      GROUP BY #{column}
      ORDER BY COUNT(#{column}) #{order}
    SQL
  end

  def initialize(table, select = nil)
    self.table = table
    self.where_conditions = []
    self.select = select || "*"
  end

  # builds a query string to exclude many words
  # must be used before any other and/or method calls
  #
  # example usage:
  # query = QueryBuilder.new('jobs')
  # query.exclude_all('position', ['senior', 'lead'])
  # Job.find_by_sql(query)
  #
  # @param [String] column_name to exclude from
  # @param [Array<String>] words to exclude
  def exclude_all(column_name, words)
    return where("") if words.empty?
    output = []
    words.each do |word|
      output << "LOWER(#{column_name}) LIKE LOWER('%#{word}%')"
    end
    where("NOT (#{output.join(' OR ')})")
  end

  def where(condition)
    self.where_conditions = [condition]
  end

  def and(condition)
    self.where_conditions << "#{no_conditions? ? nil : 'AND'} #{condition}"
  end

  def or(condition)
    self.where_conditions << "#{no_conditions? ? nil : 'OR'} #{condition}"
  end

  def to_str
    "SELECT #{select} FROM #{table} #{where_query}"
  end

  # @return [String] joined where query or '' if no conditions
  def where_query
    return '' if no_conditions?
    "WHERE #{where_conditions.join(' ')}"
  end

  private

  attr_writer :select, :table, :where_conditions

  def no_conditions?
    where_conditions.empty?
  end
end