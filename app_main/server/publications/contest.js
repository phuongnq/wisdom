Meteor.publish('contests', function() {
  return Contests.find();
});
