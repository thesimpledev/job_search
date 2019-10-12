require_relative '../../config/environment'

ActiveRecord::Schema.define do
  change_column :scrapes, :start, :time, null: false
  change_column :scrapes, :finish, :time, null: false
end