Template.home.helpers({
  point: function() {
    return Meteor.user() ? Meteor.user().point : 0;
  }
});

Template.home.events({
  'click #logout': function(event) {
    Meteor.logout(function(err){
      if (err) {
        throw new Meteor.Error("Logout failed");
      }
    });
  },
  'click #my-contests-list': function(e) {
    e.preventDefault();
    Router.go('/contest/my-contest');
  },
  'click #btn-submit-search': function(e) {
    e.preventDefault();

    var contestId = $('#input-search-contest-id').val();
    if (!contestId || contestId == '') return;

    Router.go('/contest/detail/' + contestId);
  }
});
