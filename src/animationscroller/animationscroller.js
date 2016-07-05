define(function () {

	return function (container) {

    var animationScroller = this;

    /* The container for listening scroll events. */
    this.container = container;

    /* The list of checkpoints to perform. */
    this.checkpoints = [];

    /* The list of actions to perform. */
    this.actions = [];

    /* Add a scroll listener for the container. */
    this.container.addEventListener("scroll", function () {
      var container = animationScroller.container;
      var checkpoints = animationScroller.checkpoints;
      var actions = animationScroller.actions;
      var scrollRange = container.scrollHeight - container.offsetHeight;
      var scrollTop = container.scrollTop;
      var scrollPosition = scrollTop / scrollRange;

      for (var i = 0; i < checkpoints.length; i++) {
        runCheckpoint(checkpoints[i], scrollPosition);
      }

      for (var i = 0; i < actions.length; i++) {
        animateScroll(actions[i], scrollPosition);
      }
    }, false);

    this.addCheckpoint = function (scrollPosition, doFunction, undoFunction) {
      animationScroller.checkpoints.push({
        done: false,
        position: scrollPosition || 0,
        do: doFunction || function () {},
        undo: undoFunction || function () {}
      });
    };

    this.addAnimation = function (element, start, end, states) {
      var actions = animationScroller.actions;
      var action = findAction(actions, element);

      if (action === null) {
        action = {
          element: element,
          animations: []
        };

        actions.push(action);
      }

      for (var i = 0; i < states.length; i++) {
        var state = states[i];
        var animation = findAnimation(action.animations, state.property);

        if (animation === null) {
          animation = {
            property: state.property,
            unit: state.unit,
            timeline: []
          };

          action.animations.push(animation);
        }

        var gapIndex = findEventGapIndex(animation.timeline, start, end);

        if (gapIndex >= 0) {
          animation.timeline.splice(gapIndex, 0, {
            start: start,
            end: end,
            startValue: state.startValue,
            endValue: state.endValue
          });
        }
      }
    };

    function runCheckpoint (checkpoint, scrollPosition) {
      if (scrollPosition >= checkpoint.position && checkpoint.done === false) {
        checkpoint.do();
        checkpoint.done = true;
      }

      if (scrollPosition < checkpoint.position && checkpoint.done === true) {
        checkpoint.undo();
        checkpoint.done = false;
      }
    };

    function findAction (actions, element) {
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].element === element) {
          return actions[i];
        }
      }

      return null;
    };

    function findAnimation (animations, property) {
      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i];

        if (animation.property === property) {
          return animation;
        }
      }

      return null;
    };

    function findEventGapIndex (timeline, start, end) {
      for (var i = 0; i < timeline.length; i++) {
        var event = timeline[i];

        if (end > event.start && start < event.end) {
          return -1;
        } else if (end <= event.start) {
          return i;
        } else if (i === timeline.length - 1) {
          return i + 1;
        }
      }

      return 0;
    };

    function animateScroll (scrollAnimation, scrollPosition) {
      var element = scrollAnimation.element;
      var animations = scrollAnimation.animations;
      var currentAnimations = [];

      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i];
        var timeline = animation.timeline;
        var currentEvent;

        for (var j = 0; j < timeline.length; j++) {
          currentEvent = timeline[j];

          if (scrollPosition <= currentEvent.end) {
            break;
          }
        }

        animate(element, animation, currentEvent, scrollPosition);
      }
    };

    function animate (element, animation, event, currentPosition) {
      var property = animation.property;
      var unit = animation.unit;
      var value = event.startValue;

      if (event.start <= currentPosition && currentPosition <= event.end) {
        var position = (currentPosition - event.start) / (event.end - event.start);
        value += position * (event.endValue - event.startValue);
      } else if (currentPosition > event.end) {
        value = event.endValue;
      }

      var propertyValue = value + unit;

      if (element.style[property] != propertyValue) {
        element.style[property] = propertyValue;
      }
    };
  };
});
