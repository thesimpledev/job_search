require_relative '../../config/environment'

ActiveRecord::Schema.define do
  remove_column :jobs, :review_status, :string, null: false
end