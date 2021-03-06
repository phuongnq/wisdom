var thisContest;
var ContestReactive = new ReactiveVar();
var QuestionReactive = new ReactiveVar();
var chart = null;
var MyEntry;
var interval;
var answered_number = 0;

var updateProgressBar = function() {
  if (!ContestReactive.get()) return;
  var startTime = ContestReactive.get().start_at.getTime();
  var passTime = (new Date()).getTime() - startTime;
  var percent = (passTime / (ContestReactive.get().duration * 60 * 1000)) * 100;
  percent = percent.toFixed(2);
  if (percent > 100) {
    completeEntry(MyEntry);
    percent = 100;
  }
  if (percent < 0) {
    percent = 0;
  }
  var el = $('.progress-bar');
  el.css('width', percent + '%' );
  el.text(percent + '%');
};

Template.contestDetail.created = function() {
  var contestId = this.data.contestId;
  thisContest = Contests.findOne({_id: contestId});
  if (thisContest) {
    ContestReactive.set(thisContest);
  }

  MyEntry = Entries.findOne({contest_id: contestId, user_id: Meteor.userId() });
  if (!MyEntry) {
    MyEntry = Entries.insert({
      'contest_id': contestId,
      'user_id': Meteor.userId(),
      'user_first_name': Meteor.user().services.facebook.first_name,
      'score': 0,
      'question': 0,
      'rank': 1,
      'winning': 1,
      'answers': []
    });
  }

  Meteor.startup(function() {
    Tracker.autorun(function() {
      var AllEntries = Entries.find({contest_id: contestId}, {sort: {score: 1}}).fetch();
      MyEntry = Entries.findOne({contest_id: contestId, user_id: Meteor.userId() });

      if (!chart) {
        createChart(AllEntries);
      }
      else {
        updateChart(AllEntries);
      }
    });
  });
};

Template.contestDetail.rendered = function() {
  restoreAnswer(MyEntry);

  var contestId = this.data.contestId;
  var AllEntries = Entries.find({contest_id: contestId}, {sort: {score: 1}}).fetch();
  if (!chart) {
    createChart(AllEntries);
  }
  else {
    updateChart(AllEntries);
  }

  interval = Meteor.setInterval(function() {
    updateProgressBar();
  }, 1000);
};

Template.contestDetail.helpers({
  fromMyContest: function() {
    return Session.get('backURL') === '/contest/my-contest/';
  },
  contest: function() {
    return ContestReactive.get();
  },
  contestName: function() {
    return ContestReactive.get() ? ContestReactive.get().name : 'Contest Details';
  },
  questionContent: function() {
    var ret = QuestionReactive.get() ? QuestionReactive.get().content : null;
    if (typeof MathJax !== 'undefined') {
      $('div.question').html('');
      MathJax.Hub.Queue(['Typeset',MathJax.Hub,ret]);
    }
    return ret;
  },
  questionListButtons: function() {
    if (!thisContest) return null;
    var qnum = thisContest.questions.length;
    var listbuttons = [];
    for (var i = 0; i < qnum; i ++){
      listbuttons.push(i);
    }
    return listbuttons;
  },
  answers: function() {
    var current = QuestionReactive.get() ? QuestionReactive.get().current : null;

    if (current == null || !thisContest) return null;

    if(!thisContest || !thisContest.questions[current]) return null;

    var answers = thisContest.questions[current].answers;
    for (var i in answers) {
      answers[i].ansClass = 'btn-default';
      if (MyEntry && MyEntry.answers && MyEntry.answers[current] && answers[i].code == MyEntry.answers[current]) {
        if (MyEntry.answers[current] == thisContest.questions[current].correct_answer) {
          answers[i].ansClass = 'btn-success';
        } else {
          answers[i].ansClass = 'btn-danger';
        }
      }
      else if (MyEntry.answers[current] && answers[i].code == thisContest.questions[current].correct_answer){
        answers[i].ansClass = 'btn-primary';
      }
    }
    return thisContest.questions[current].answers;
  }
});

Template.contestDetail.destroyed = function() {
  Meteor.clearInterval(interval);
  Session.set('backURL', undefined);
};

Template.contestDetail.events({
  'click .question-btn': function(e) {
    e.preventDefault();
    var qid = $(e.target).closest('.question-btn').attr('question-id');
    jumpQuestion(qid);
  },
  'click .back-btn': function(e) {
    e.preventDefault();
    if (Session.get('backURL') === '/contest/my-contest/') {
      Router.go('/contest/my-contest/');
    } else {
      Router.go('/contest/math');
    }
  },
  'click .review-contest-btn': function(e) {
    e.preventDefault();
    Router.go('/contest/review/' + Template.instance().data.contestId);
  },
  'click .choice': function(e) {
    $(e.target).blur();
    e.preventDefault();
    answerQ(getCurrentQuestion(), $(e.target).data('code'));
  }
});

/**
 *
 */
function createChart(AllEntries) {
	nv.addGraph(function() {
	  chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      .tooltips(false)
      .showValues(true)
      .duration(350)
      .showYAxis(false)
      .margin({left: 10});

	  updateChart(AllEntries);
	  nv.utils.windowResize(chart.update);

	  return chart;
	});
}

function updateChart(AllEntries) {
  if (!chart) return;
  d3.select('#chart svg#c1')
      .datum(chartData(AllEntries))
      .call(chart);
};

//Each bar represents a single discrete quantity.
function chartData(AllEntries) {
  var values = [];
  for (var i = 0; i < AllEntries.length; i ++){
    var entry = AllEntries[i];
    values.push({
      label: entry.user_first_name,
      value: entry.score
    });
  }
  return  [
    {
      key: 'Cumulative Return',
      values: values
    }
  ]
}

function jumpQuestion(number) {
  if (!thisContest) return;
  if (number < 0) number = 0;
  else if (number >= thisContest.questions.length) number = thisContest.questions.length - 1;
  QuestionReactive.set({
    'current': number,
    'content': thisContest.questions[number] ? thisContest.questions[number].text : 'Done'
  });
  if (MyEntry){
    MyEntry.question = number;
    //save
    Entries.update({_id: MyEntry._id}, MyEntry);
  }

  $('.btn-currentQ').removeClass('btn-currentQ');
  $('.question-btn-' + number).addClass('btn-currentQ');
}

function nextQuestion() {
  if (!thisContest) return;
  if (answered_number == thisContest.questions.length ) {
    completeEntry(MyEntry);
  }
  var number = parseInt(getCurrentQuestion()) + 1;
  while (MyEntry.answers[number]) number ++;
  jumpQuestion(number);
}

function answerQ(qnumber, ansCode) {
  if (!MyEntry) return;
  if (MyEntry.answers[qnumber]) return;
  if (thisContest.questions[qnumber].correct_answer == ansCode){
    MyEntry.score += thisContest.questions[qnumber].reward || 1;
    //mark right
    markRight(qnumber);
  }
  else {
    //mark wrong
    markWrong(qnumber);
  }

  MyEntry.score -= thisContest.questions[qnumber].cost || 0;

  MyEntry.answers[qnumber] = ansCode;
  MyEntry.status = 'inProgress';

  answered_number ++;

  jumpQuestion(getCurrentQuestion()); //mark answer
  setTimeout(nextQuestion, 500);
}

function getCurrentQuestion() {
  return QuestionReactive.get().current;
}

function markRight(qnumber) {
  $('.question-btn-' + qnumber).removeClass('btn-default btn-danger').addClass('btn-success');
}

function markWrong(qnumber){
  $('.question-btn-' + qnumber).removeClass('btn-default btn-success').addClass('btn-danger');
}

function restoreAnswer(MyEntry) {
  if (!thisContest || !MyEntry || !MyEntry.answers) return;
  var answers = MyEntry.answers;
  var lastnum = -1;
  for (var qnumber in answers) if (answers[qnumber]){
    lastnum = qnumber;
    var question = thisContest.questions[qnumber];
    if (question.correct_answer == answers[qnumber]){
      markRight(qnumber);
    }
    else {
      markWrong(qnumber);
    }
    answered_number ++;
  }
  jumpQuestion(parseInt(lastnum) + 1);
}

function completeEntry(MyEntry) {
  if (!MyEntry || MyEntry.status === 'complete') return;
  MyEntry.status = 'complete';
  Entries.update({_id: MyEntry._id}, MyEntry);
  var user = Meteor.user();

  //update point
  var point = user.point + MyEntry.score;
  Meteor.call('updateUserPoint', point, null);
}
