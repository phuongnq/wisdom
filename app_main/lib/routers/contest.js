
Router.route('/contest/detail/:_contestId', {
  name: 'contestDetail',
  data: function() {
    return {
      contestId: this.params._contestId
    };
  },
  waitOn: function() {
    return [
      Subs.subscribe('contests'),
      Subs.subscribe('entries')
    ];
  }
});

Router.route('/contest/math', {
  name:'mathContestsList',
  onBeforeAction: function() {
    this.next();
  }
});

Router.route('/comming-soon', {
  name: 'comingSoon'
});

Router.route('/contest/my-contest', {
  name: 'contestMyContest'
});

Router.route('/contest/upcoming/:_contestId', {
  name: 'contestUpcomingContest',
  waitOn: function() {
    return [
      Subs.subscribe('contests')
    ];
  },
  data: function() {
    return {
      contestId: this.params._contestId
    };
  },
  onBeforeAction: function() {
    var contest = Contests.findOne(this.params._contestId);
    if (!contest) {
      Router.go('/contest/math');
      return;
    }
    var now = new Date();
    if (contest.start_at < now) {
      Router.go('/contest/detail/' +  this.params._contestId);
    } else if (contest.start_at > now && contest.start_at.getTime() + contest.duration * 60 * 1000 < now.getTime() ) {
      Router.go('home');
    }
    Session.set('currentContest', contest);
    this.next();
  }
});
