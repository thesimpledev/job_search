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

def stored_good_keywords_or_default
  default = '
css 10
html 10
ruby 20
rails 20
react 10
redux 10
beer 5
appacademy 100
apprentice 5
beer 5
culture 5
cypress 5
enzyme 5
equity 5
javascript 5
jest 5
jquery 5
mysql 5
postgresql 5
postgres 5
pto 5'
  cookies[:good_keywords] || default
end

def stored_bad_keywords_or_default
  default = '
phd -10
crypto -10
blockchain -10
java -10
c# -10
c++ -10'
  cookies[:bad_keywords] || default
end

def stored_position_exclusions_or_default
  default = '
senior
lead
instructor
scientist
aws
teaching
teacher
'
  cookies[:position_exclusions] || default
end