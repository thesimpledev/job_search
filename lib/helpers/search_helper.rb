def location_to_background
  return 'sanfrancisco.jpg' unless cookies[:location]
  {
    'San Francisco, CA' => 'sanfrancisco.jpg',
    'New York, NY' => 'newyork.jpg',
    'Boston, MA' => 'boston.jpg',
    'Austin, TX' => 'austin.jpg',
    'Seattle, WA' => 'seattle.jpg',
    'Denver, CO' => 'denver.jpg',
    'Remote' => 'remote.jpg',
  }[cookies[:location]]
end

def stored_location_or_default
  cookies[:location] || 'San Francisco, CA'
end

def stored_points_or_default
  cookies[:passing_points] || 50
end

def pluralized_points
  points = (cookies[:passing_points] || 50).to_i
  "#{points} point#{points == 1 ? '' : 's'}"
end