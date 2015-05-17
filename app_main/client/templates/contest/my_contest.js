Template.contestMyContest.helpers({
  contests: function() {
    var myEntries = Entries.find({user_id: Meteor.userId(), status: 'complete'}).fetch();
    if (!myEntries) return;
    var contestIds = _.map(myEntries, function(entry) {
      return entry.contest_id;
    });
    var contests = Contests.find({_id: {$in: contestIds}}).fetch();
    contests.forEach(function(contest) {
      contest.entry_count = Entries.find({contest_id: contest._id}).count();
      var entry = Entries.findOne({user_id: Meteor.userId(), contest_id: contest._id});
      contest.won = entry.score;
    });
    return contests;
  }
});

Template.contestMyContest.events({
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('home');
  },
  'click .contest-cell': function(e) {
    var contestId = $(e.target).closest('.contest-cell').attr('contest-id');
    Session.set('backURL', '/contest/my-contest/');
    Router.go('/contest/detail/' + contestId);
  }
});
