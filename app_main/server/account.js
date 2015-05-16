Accounts.onCreateUser(function(options, user) {
  user.point = 0;

  return user;
});

Accounts.validateLoginAttempt(function(loginRequest){
  return loginRequest;
});
