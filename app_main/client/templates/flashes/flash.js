if (typeof(Flash) == 'undefined') {
  Flash = {
    flashDeps: new Deps.Dependency(),
    config: {
      timeout: null,
    },
    flashes: {},
    popups: {}
  };
}

Flash.get = function (id) {
  Flash.flashDeps.depend();
  if (id) {
    return {flash_template: Flash.flashes[id].template, flash_data: Flash.flashes[id]}
  }

  var flashes = [];
  _.each(_.values(Flash.flashes), function (flash) {
    flashes.push({flash_template: flash.template, flash_data: flash});
  });
  return flashes;
}

Flash.flashSet = function (flash_data) {
  if (flash_data.delay) {
    flashes = Session.get('flashes') || {};
    flash_data.route = Router.current().route.getName();
    flashes[flash_data.id] = flash_data;
    Session.set('flashes', flashes);
    return;
  }

  var timer,
      id = flash_data.id;

  this.flashes[flash_data.id] = flash_data;

  this.flashDeps.changed();

  if (flash_data.timeout) {
    timer = setTimeout(function () {
      Flash.clear(id);
      clearTimeout(timer);
    }, flash_data.timeout);
  }
};

Flash.flashStateFn = function (state) {
  return function (message, flash_data) {
    flash_data           = flash_data || {};
    flash_data.msg       = message;
    flash_data.classes   = (flash_data.classes || []);
    flash_data.template  = flash_data.template || 'flashDefault';
    flash_data.timeout   = flash_data.timeout || Flash.config.timeout;
    flash_data.timestamp = Date.now();
    flash_data.classes.push('alert', 'alert-'+state);
    if (flash_data.unique || flash_data.id) {
      flash_data.id        = flash_data.id || flash_data.timestamp;
    } else {
      flash_data.id = '__default__' ;
    }

    return Flash.flashSet(flash_data);
  };
};

Flash.set = Flash.flashStateFn('warning');
Flash.warning = Flash.flashStateFn('warning');
Flash.success = Flash.flashStateFn('success');
Flash.info = Flash.flashStateFn('info');
Flash.danger = Flash.flashStateFn('danger');
Flash.popup = function(msg, flash_data) {
  if (flash_data && !flash_data.template) flash_data.template = "flashPopup";
  Flash.info(msg, flash_data);
  $('.modal.flash-popup').modal('show');
};

Flash.clear = function (id) {
  if (!id) {
    _.each(_.keys(Flash.flashes), function (key) {
      delete Flash.flashes[key];
    })
  } else {
    delete Flash.flashes[id];
  }
  Flash.flashDeps.changed();
};


// If IronRouter is present, -
// Clear Flash messages on page-change
Meteor.startup(function () {
  var newRoute;
  var oldRoute;
  if (typeof(Router) !== 'undefined' && Router.routes) {
    Router.onBeforeAction(function () {
      newRoute = Router.current().route.getName();
      if (!oldRoute || oldRoute != newRoute) {
        oldRoute = newRoute;
        if (!Flash) return this.next();
        Flash.clear();
        this.next();
      } else {
        this.next();
      }
      // if (!Flash) return this.next();
      // Flash.clear();
      // delay_flashes = Session.get('flashes');
      // var wait_flashes = {};
      // if (!_.isEmpty(delay_flashes)) {
      //   _.each(_.keys(delay_flashes), function (flash_key) {
      //     if (!delay_flashes[flash_key].route || delay_flashes[flash_key].route !== Router.current().route.getName()) {
      //       debugger;
      //       Flash.flashes[flash_key] = delay_flashes[flash_key];
      //     } else {
      //       wait_flashes[flash_key] = delay_flashes[flash_key];
      //     }
      //   })
      //   Session.set('flashes', wait_flashes);
      // }
      // this.next();
    });
  }
});

Template.registerHelper('getFlashes', function() {
  return {flashes: Flash.get()};
});
