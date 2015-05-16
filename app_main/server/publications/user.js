Meteor.publish('userData', function() {
  if (this.userId) {
   return Meteor.users.find(
    {_id: this.userId},
    {fields: {point: 1}});
  } else {
    return null;
  }
});
