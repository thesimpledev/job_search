require_relative '../../config/environment'
require_relative '../../lib/models/scrape'

ActiveRecord::Schema.define do
  Scrape.destroy_all
  add_column :scrapes, :created_at, :datetime, null: false
  add_column :scrapes, :updated_at, :datetime, null: false
  remove_column :scrapes, :date_ran
end