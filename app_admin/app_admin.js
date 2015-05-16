Contests = new Mongo.Collection('contests');

if (Meteor.isClient) {

        Meteor.subscribe('contests');

  Template.contestCalendar.helpers({
    contest: function() {
      var contest = Session.get("contest");
      for (var i = 0; i < contest.prize_structure.length; i++) {
        var prize = contest.prize_structure[i];
        prize.prize = i+1;
      }
      for (var i = 0; i < contest.questions.length; i++) {
        var question = contest.questions[i];
        question.question = i+1;
        for (var j=0; j < question.answers.length; j++) {
          question.answers[j].question = question.question;
          if (question.answers[j].code == question.correct_answer) {
            question.answers[j].correct_answer = true;
          }
        }
      }
      return contest;
    },
    
    creating: function() {
      return (!Session.get("contestId"));
    }
  });

  Template.contestCalendar.events({
    'click #prize-add': function() {
      var contest = getContestFromForm();
      contest.prize_structure.push({winner: 0, value: 0});
      Session.set("contest", contest);
    },
    'click #prize-delete': function(e) {
      var prize = $(e.target).attr("prize");
      var contest = getContestFromForm();
      contest.prize_structure.splice(prize-1, 1);
      Session.set("contest", contest);
    },
    'click #question-add': function() {
      var contest = getContestFromForm();
    contest.questions.push({text:"", answers:[{code:"a", text:""},{code:"b", text:""},{code:"c", text:""},{code:"d", text:""}], cost: 0, reward: 0, correct_answer: "a" });
      Session.set("contest", contest);
    },
    'click #question-delete': function(e) {
      var question = $(e.target).attr("question");
      var contest = getContestFromForm();
      contest.questions.splice(question-1, 1);
      Session.set("contest", contest);
    },
    'click #contest-save': function() {
      saveContest();
    },
  });
  
  Template.contestCalendar.rendered = function() {

    var contest = {prize_structure:[{winner:0, value: 0}], questions: [{text:"", answers:[{code:"a", text:""},{code:"b", text:""},{code:"c", text:""},{code:"d", text:""}], cost: 0, reward: 0, correct_answer: "a" }]};
    Session.set("contest", contest);  

    // create Calendar
    $('#fullcalendar').fullCalendar({
      defaultView: 'month',
      header: {
        left:   'prev,next today',
        center: 'title',
        right:  'month,agendaWeek,agendaDay'
      },

      timezone: 'local',

      events: function(start, end, timezone, callback) {
        var startDate        = new Date(start.toDate().getTime());
        var endDate          = new Date(end  .toDate().getTime());

        var events = [];

        var contests = Contests.find().map(function(c) {
          var title     = c.name;
          var start     = new Date(c.start_at);
          var color     = "blue";
          return {title: title, start: start, color: color, contest: c};
        });
        callback(contests);        
        
      },

      dayClick: function(date, jsEvent, view) {
        showCreateContestDlg(date.toDate());
      },
      
      eventClick: function(calEvent, jsEvent, view) {
        showContestDlg(calEvent.contest);
      }      
    });
  };
  
  var showCreateContestDlg = function(date) {
    $('#contest-start_at') .val(date.toUTCString());
    $('#create-contest-dlg').modal('show');
  }; 
  
var showContestDlg = function(contest) {
  Session.set('contest',  contest);
  $('#create-contest-dlg').modal('show');
};  
  
  var getContestFromForm = function() {
    var contest = Session.get("contest");
    contest.name = $('#contest-name') .val();
    contest.subject = $('#contest-subject') .val();
    contest.start_at = new Date($('#contest-start_at') .val());
    contest.max_entries = $('#contest-max_entries') .val();
    for (var i = 0; i < contest.prize_structure.length; i++) {
      var prize = contest.prize_structure[i];
      prize.winner = parseInt($('#winners_'+(i+1)) .val()) || 0;
      prize.value = parseInt($('#value_'+(i+1)) .val()) || 0;
    }
    for (var i = 0; i < contest.questions.length; i++) {
      var question = contest.questions[i];
      question.text = $('#text_'+(i+1)) .val();
      question.cost = parseInt($('#cost_'+(i+1)) .val()) || 0;
      question.reward = parseInt($('#reward_'+(i+1)) .val()) || 0;
      question.correct_answer = $('input[name=correct_answer_'+(i+1)+']:checked').val();
      for (var j = 0; j < question.answers.length; j++) {
        var answer = question.answers[j];
        answer.text = $('#answer_'+(i+1)+'_'+answer.code) .val();
      }
    }    
    return contest;
  };  

  var saveContest = function() {
    var contest = getContestFromForm();
    Meteor.call('saveContest', contest, function() {
      $('#fullcalendar').fullCalendar('refetchEvents');
    });
    $('#create-contest-dlg').modal('hide');
  };
  
}

if (Meteor.isServer) {
  
  Meteor.publish('contests', function() {
      return Contests.find();
  });  
  
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  Meteor.methods({
    saveContest: function(params) {
      if (params._id) {
        console.log('Update contest: ' + JSON.stringify(params));
        Contests.update({_id: params._id}, params);
      } else {
        console.log('Create contest: ' + JSON.stringify(params));
        Contests.insert(params);
      }
    }    
  });  
}
