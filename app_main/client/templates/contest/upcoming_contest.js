Template.contestUpcomingContest.helpers({
  contest: function() {
    return Session.get('currentContest');
  }
});

Template.contestUpcomingContest.destroyed = function() {
  Session.set('currentContest', undefined);
};

Template.contestUpcomingContest.events({
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('/contest/math');
  },
})
