class AlertDebug
  class << self
    def job_saved(job)
      puts("saved, '#{job.position}"
        .black
        .on_green)
    end

    def already_saved
      puts('Already saved!'.light_blue)
    end

    def prime
      puts('Is prime, skipping.'.yellow)
    end

    def on_page(number)
      puts("On page: #{number}".white.on_magenta)
    end

    def timeout(message)
      puts message.red.on_white
    end

    def bad_position(position)
      puts("Bad position (#{position}), skipping".light_blue)
    end

    def start_search(position, location)
      puts('-' * 20)
      puts("Searching: #{position} @ #{location}")
      puts('-' * 20)
    end
  end
end