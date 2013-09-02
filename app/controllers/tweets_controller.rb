class TweetsController < ApplicationController
  def showtweets
    @liberal_tweets = []
    @greens_tweets = []
    @labor_tweets = []

    @greens_tweets << Twitter.user_timeline("greens", :count => 10)
    @greens_tweets << Twitter.user_timeline("senatormilne", :count => 10)
    @labor_tweets << Twitter.user_timeline("KRuddMP", :count => 10)
    @labor_tweets << Twitter.user_timeline("AustralianLabor", :count => 10)
    @liberal_tweets << Twitter.user_timeline("LiberalAus", :count => 10)
    @liberal_tweets << Twitter.user_timeline("TonyAbbottMHR", :count => 10)
    @liberal_tweets.flatten!.sort! { |a, b| b.created_at <=> a.created_at }
    @greens_tweets.flatten!.sort! { |a, b| b.created_at <=> a.created_at }
    @labor_tweets.flatten!.sort! { |a, b| b.created_at <=> a.created_at }


    @people_tweets = Twitter.search("#ausvotes -rt", :lang => "en", :count => 10).attrs[:statuses]
    expires_in 10.minutes, public: true
  end
end