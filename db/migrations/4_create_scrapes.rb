require_relative '../../config/environment'

ActiveRecord::Schema.define do
  create_table :scrapes, force: true do |t|
    t.time :start,        null: false
    t.time :finish,       null: false
    t.integer :pages,     null: false
    t.string :location,   null: false
    t.string :position,   null: false
    t.date :date_ran,     null: false
  end

  add_reference :jobs, :scrape, foreign_key: true
end