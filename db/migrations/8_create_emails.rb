require_relative '../../config/environment'

ActiveRecord::Schema.define do
  create_table :emails, force: true do |t|
    t.string :email, null: false
  end
end