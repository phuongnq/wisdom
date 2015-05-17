Accounts.onCreateUser(function(options, user) {
  user.point = 0;

  return user;
});

Accounts.validateLoginAttempt(function(loginRequest){
  return loginRequest;
});

Accounts.updateUserPoint = function(point) {
  Meteor.users.update({_id: Meteor.userId()}, {$set: {point: point}});
};

Meteor.methods({
  updateUserPoint: Accounts.updateUserPoint
})
