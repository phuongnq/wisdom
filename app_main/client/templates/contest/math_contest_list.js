
Template.mathContestsList.created = function() {
};

Template.mathContestsList.helpers({
  contests: function() {
    var contests = Contests.find({subject: 'Mathematics'}).fetch();
    contests.forEach(function(contest) {
      var prizeStructure = contest.prize_structure;
      var totalPrize = 0;
      _.each(prizeStructure, function(prize) {
        totalPrize += prize.winner * prize.value;
      });
      contest.total_prizes = totalPrize;
      contest.entry_count = Entries.find({contest_id: contest._id}).count();
    });
    return contests;
  }
})

Template.mathContestsList.events({
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('home');
  },
  'click .contest-cell': function(e) {
    var contestId = $(e.target).closest('.contest-cell').attr('contest-id');
    Router.go('/contest/detail/' + contestId);
  }
});
