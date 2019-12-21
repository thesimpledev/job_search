def active_link(text, options)
  href = options[:href]
  clazz = options[:class]
  active = (request.path == href ? 'active' : '')
  combined_class = clazz + ' ' + active
  "<a href='#{href}' class='#{combined_class}'>#{text}</a>"
end