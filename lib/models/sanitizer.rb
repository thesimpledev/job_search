# Sanitize inputs

class Sanitizer
  # location can come in as '- some city name, STATEINITIALS (extra detail)'
  # or as '- Remote (extra details)'. So we either match words before comma
  # and initials after or just the remote part. If it's already sanitized, it
  # will return itself.
  #
  # example:
  # Parser.sanitize_location('- San Luis Somewhere, CA (extra details here)')
  # => 'San Luis Somewhere, CA'
  #
  # Parser.sanitize_location('- Remote with some extra detail')
  # => 'Remote'
  #
  # Parser.sanitize_location('San Francisco, CA')
  # => 'San Francisco, CA'
  #
  # @param [String] location to sanitize
  # @return [String] sanitized location
  #
  def self.location(location)
    location.match(/^[-\s]*(?'location'([\w*\s*]*, \w+)|([\w*]*))/)[:location]
  end
end
