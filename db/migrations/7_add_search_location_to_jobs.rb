require_relative '../../config/environment'
require_relative '../../lib/models/job'

ActiveRecord::Schema.define do
  Job.destroy_all
  add_column :jobs, :search_location, :text, null: false
end