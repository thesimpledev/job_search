def location_to_background
  return 'sanfrancisco.jpg' unless (params[:location] || cookies[:location])
  {
    'San Francisco, CA' => 'sanfrancisco.jpg',
    'New York, NY' => 'newyork.jpg',
    'Boston, MA' => 'boston.jpg',
    'Austin, TX' => 'austin.jpg',
    'Seattle, WA' => 'seattle.jpg',
    'Denver, CO' => 'denver.jpg',
    'Remote' => 'remote.jpg',
  }[params[:location] || cookies[:location]]
end

def stored_location_or_default
  params[:location] || cookies[:location] || 'San Francisco, CA'
end

def stored_points_or_default
  cookies[:passing_points] || 50
end

def pluralized_points
  points = (cookies[:passing_points] || 50).to_i
  "#{points} point#{points == 1 ? '' : 's'}"
end

def stored_good_keywords
  cookies[:good_keywords] ? JSON.parse(cookies[:good_keywords]) : nil
end

def stored_bad_keywords
  cookies[:bad_keywords] ? JSON.parse(cookies[:bad_keywords]) : nil
end

def stored_position_exclusions_or_default
  default = 'senior
lead
instructor
scientist
aws
teaching
teacher'
  cookies[:position_exclusions] || default
end