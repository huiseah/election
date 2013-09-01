class TweetsController < ApplicationController
  def showtweets
    @official_tweets = []
    @official_tweets << Twitter.user_timeline("greens", :count => 10)
    @official_tweets << Twitter.user_timeline("senatormilne", :count => 10)
    @official_tweets << Twitter.user_timeline("KRuddMP", :count => 10)
    @official_tweets << Twitter.user_timeline("AustralianLabor", :count => 10)
    @official_tweets << Twitter.user_timeline("LiberalAus", :count => 10)
    @official_tweets << Twitter.user_timeline("TonyAbbottMHR", :count => 10)
    @official_tweets.flatten!.sort! { |a, b| b.created_at <=> a.created_at }

    @people_tweets = Twitter.search("#kickstarter -rt", :lang => "en").attrs[:statuses]
    expires_in 10.minutes, public: true
  end
end