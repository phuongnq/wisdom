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
  }
});
