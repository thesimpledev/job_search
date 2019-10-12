require_relative '../../config/environment'
require_relative '../../lib/models/job'

ActiveRecord::Schema.define do
  add_column :jobs, :date_scraped, :date

  Job.all.each do |job|
    job.update(date_scraped: Date.today)
  end

  change_column_null :jobs, :date_scraped, false
end