class QueryBuilder
  def self.unique_with_count(table, column, order = "ASC")
    <<-SQL
      SELECT DISTINCT(#{column}), COUNT(#{column})
      FROM #{table}
      GROUP BY #{column}
      ORDER BY COUNT(#{column}) #{order}
    SQL
  end

  def self.not_similar_to(column_name, exclusions)
    regexp = exclusions.map { |term| "[[:<:]]#{term.downcase}[[:>:]]" }.join('|')
    ["LOWER(#{column_name}) !~* ?", regexp]
  end
end