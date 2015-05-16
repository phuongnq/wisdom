var intervals = [];

var getCountDownTime = function(startTime) {
  if (!startTime) {
    return 'N/A';
  }

  var currentTime = new Date();

  if (startTime < currentTime) {
    return '0h 00m 00s';
  }

  var countDownTimeSpan = countdown(startTime);

  //more than 24hours left
  if (countDownTimeSpan.days == 1) {
    return '1 day';
  } else if (countDownTimeSpan.days > 1) {
    return countDownTimeSpan.days + ' days';
  }

  var hoursLeft = countDownTimeSpan.hours;

  var minutesLeft = countDownTimeSpan.minutes;
  if (minutesLeft < 10) minutesLeft = '0' + minutesLeft;

  var secondsLeft = countDownTimeSpan.seconds;
  if (secondsLeft < 10) secondsLeft = '0' + secondsLeft

  return hoursLeft + 'h ' + minutesLeft + 'm ' + secondsLeft + 's';
};

Template.contestCountDown.rendered = function() {
  var startTime = this.data.startTime;
  var contestId = this.data.contestId;

  var showTime = getCountDownTime(startTime);
  $('.count-down-span-' + contestId).text(showTime);

  var interval = Meteor.setInterval(function() {
    var showTime = getCountDownTime(startTime);
    $('.count-down-span-' + contestId).text(showTime);
  }, 1000);
  intervals.push(interval);
};

Template.contestCountDown.destroyed = function() {
  for(var i = 0; i < intervals.length; i++) {
    var interval = intervals[i];
    if (interval) {
      Meteor.clearInterval(interval);
      intervals.splice(i, 1);
    }
  }
};
