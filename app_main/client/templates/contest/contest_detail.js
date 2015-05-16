var thisContest;
var ContestReactive = new ReactiveVar();
var QuestionReactive = new ReactiveVar();
var chart = null;
var MyEntry;
var interval;

var updateProgressBar = function() {
  if (!ContestReactive.get()) return;
  var startTime = ContestReactive.get().start_at.getTime();
  var passTime = (new Date()).getTime() - startTime;
  var percent = (passTime / (ContestReactive.get().duration * 60 * 1000)) * 100;
  percent = percent.toFixed(2);
  if (percent > 100) {
    completeEntry(MyEntry);
    return;
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

  Tracker.autorun(function() {
    //console.log('There are ' + Posts.find().count() + ' posts');
    var AllEntries = Entries.find({contest_id: contestId}, {sort: {score: 1}}).fetch();
    MyEntry = Entries.findOne({contest_id: contestId, user_id: Meteor.userId() }) ||
      Entries.insert({
        "contest_id": contestId,
        "user_id": Meteor.userId(),
        "user_first_name": Meteor.user().services.facebook.first_name,
        "score": 0,
        "question": 0,
        "rank": 1,
        "winning": 1,
        "answers": []
      });
    if (!chart) {
      createChart(AllEntries);
    }
    else {
      updateChart(AllEntries);
    }

  });
}

Template.contestDetail.rendered = function() {
  //restore current result
  restoreAnswer(MyEntry);
  //jumpQuestion(1);

  interval = Meteor.setInterval(function() {
    updateProgressBar();
  }, 1000);
};

Template.contestDetail.helpers({
  contest: function() {
    return ContestReactive.get();
  },
  contestName: function() {
    return ContestReactive.get() ? ContestReactive.get().name : 'Contest Details';
  },
  questionContent: function(){
    var ret = QuestionReactive.get() ? QuestionReactive.get().content : null;
    Meteor.setTimeout(function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub,ret]);}, 500);
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
  answers: function(){
    var current = QuestionReactive.get() ? QuestionReactive.get().current : null;
    if (current == null) return null;
    var answers = thisContest.questions[current].answers;
    for (var i in answers){
      answers[i].ansClass = 'btn-default';
      if (MyEntry && MyEntry.answers[current] && answers[i].code == MyEntry.answers[current]){
        if (MyEntry.answers[current] == thisContest.questions[current].correct_answer){
          answers[i].ansClass = 'btn-success';
        } else {
          answers[i].ansClass = 'btn-danger';
        }
      }
    }
    return thisContest.questions[current].answers;
  }
});

Template.contestDetail.destroyed = function() {
  Meteor.clearInterval(interval);
};

Template.contestDetail.events({
  'click .upvote': function(e) {
    e.preventDefault();
    //Meteor.call('upvote', this._id);
  },
  'click .question-btn': function(e) {
    e.preventDefault();
    $('div.question').html('');
    var qid = $(e.target).closest('.question-btn').attr('question-id');
    jumpQuestion(qid);
  },
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('/contest/math');
  },
  'click .choice': function(e) {
    e.preventDefault();
    answerQ(getCurrentQuestion(), $(e.target).data('code'));
  }
});

/**
 *
 */
function createChart(AllEntries){
	nv.addGraph(function() {
	  chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .duration(350)
      .showYAxis(false)
      //.showXAxis(false)
      .margin({left: 10})
      ;

	  updateChart(AllEntries);

	  /*d3.select('#chart svg#c2')
	      .datum(chartData())
	      .call(chart);*/

	  nv.utils.windowResize(chart.update);

	  return chart;
	});
}

function updateChart(AllEntries){
  if (!chart) return;
  console.log('update chart');
  d3.select('#chart svg#c1')
      .datum(chartData(AllEntries))
      .call(chart);
}

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
      key: "Cumulative Return",
      values: values
    }
  ]
}

function jumpQuestion(number){
  if (!thisContest) return;
  if (number < 0) number = 0;
  else if (number >= thisContest.questions.length) number = thisContest.questions.length - 1;
  QuestionReactive.set({
    'current': number,
    'content': thisContest.questions[number] ? thisContest.questions[number].text : 'Done'
  })
  if (MyEntry){
    MyEntry.question = number;
    //save
    Entries.update({_id: MyEntry._id}, MyEntry);
  }

  $('.btn-currentQ').removeClass('btn-currentQ');
  $('.question-btn-' + number).addClass('btn-currentQ');
}

function nextQuestion(){
  var number = parseInt(getCurrentQuestion()) + 1;
  jumpQuestion(number);
}

function answerQ(qnumber, ansCode){
  if (!MyEntry) return;
  if (MyEntry.answers[qnumber]) return;
  if (thisContest.questions[qnumber].correct_answer == ansCode){
    MyEntry.score ++;
    //mark right
    markRight(qnumber);
  }
  else {
    //mark wrong
    markWrong(qnumber);
  }

  MyEntry.answers[qnumber] = ansCode;
  MyEntry.status = 'inProgress';

  nextQuestion();
}

function getCurrentQuestion(){
  return QuestionReactive.get().current;
}

function markRight(qnumber){
  $('.question-btn-' + qnumber).removeClass('btn-default btn-danger').addClass('btn-success');
}

function markWrong(qnumber){
  $('.question-btn-' + qnumber).removeClass('btn-default btn-success').addClass('btn-danger');
}

function restoreAnswer(MyEntry){
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
  }
  jumpQuestion(parseInt(lastnum) + 1);
}

function completeEntry(MyEntry){
  if (!MyEntry) return;
  Entries.update({_id: MyEntry._id}, {status: 'complete'});
}