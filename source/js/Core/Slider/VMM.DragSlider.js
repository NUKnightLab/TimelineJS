/* DRAG SLIDER
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.DragSlider == 'undefined') {
	// VMM.DragSlider.createSlidePanel(drag_object, move_object, w, padding, sticky);
	// VMM.DragSlider.cancelSlide();

	VMM.DragSlider = function() {
		var drag = {
			element:		"",
			element_move:	"",
			constraint:		"",
			sliding:		false,
			pagex: {
				start:		0,
				end:		0
			},
			left: {
				start:		0,
				end:		0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false,
			ease:			"easeOutExpo"
		},
		dragevent = {
			down:		"mousedown",
			up:			"mouseup",
			leave:		"mouseleave",
			move:		"mousemove"
		},
		mousedrag = {
			down:		"mousedown",
			up:			"mouseup",
			leave:		"mouseleave",
			move:		"mousemove"
		},
		touchdrag = {
			down:		"touchstart",
			up:			"touchend",
			leave:		"mouseleave",
			move:		"touchmove"
		};
		
		this.createPanel = function(drag_object, move_object, constraint, touch) {
			drag.element		= drag_object;
			drag.element_move	= move_object;
			
			if ( constraint != null && constraint != "") {
				drag.constraint = constraint;
			} else {
				drag.constraint = false;
			}
			if ( touch) {
				drag.touch = touch;
			} else {
				drag.touch = false;
			}
			trace("TOUCH" + drag.touch);
			if (drag.touch) {
				dragevent = touchdrag;
			} else {
				dragevent = mousedrag;
			}
			
			makeDraggable(drag.element, drag.element_move);
		}
		
		this.updateConstraint = function(constraint) {
			trace("updateConstraint");
			drag.constraint = constraint;
		}
		
		var makeDraggable = function(drag_object, move_object) {
			
			VMM.bindEvent(drag_object, onDragStart, dragevent.down, {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, onDragEnd, dragevent.up, {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, onDragLeave, dragevent.leave, {element: move_object, delement: drag_object});
			
	    }
		this.cancelSlide = function(e) {
			VMM.unbindEvent(drag.element, onDragMove, dragevent.move);
			return true;
		}
		var onDragLeave = function(e) {
			VMM.unbindEvent(e.data.delement, onDragMove, dragevent.move);
			if (!drag.touch) {
				e.preventDefault();
			}
			e.stopPropagation();
			if (drag.sliding) {
				drag.sliding = false;
				dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
		}
		
		var onDragStart = function(e) {
			dragStart(e.data.element, e.data.delement, e);
			if (!drag.touch) {
				e.preventDefault();
			}
			e.stopPropagation();
			return true;
		}
		
		var onDragEnd = function(e) {
			if (!drag.touch) {
				e.preventDefault();
			}
			e.stopPropagation();
			if (drag.sliding) {
				drag.sliding = false;
				dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
		}
		var onDragMove = function(e) {
			dragMove(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
		var dragStart = function(elem, delem, e) {
			if (drag.touch) {
				trace("IS TOUCH")
				VMM.Lib.css(elem, '-webkit-transition-duration', '0');
				drag.pagex.start = e.originalEvent.touches[0].screenX;
			} else {
				drag.pagex.start = e.pageX;
			}
			drag.left.start = getLeft(elem);
			drag.time.start = new Date().getTime();
			
			VMM.Lib.stop(elem);
			VMM.bindEvent(delem, onDragMove, dragevent.move, {element: elem});

	    }
		var dragEnd = function(elem, delem, e) {
			VMM.unbindEvent(delem, onDragMove, dragevent.move);
			dragMomentum(elem, e);
		}
		var dragMove = function(elem, e) {
			drag.sliding = true;
			if (drag.touch) {
				drag.pagex.end = e.originalEvent.touches[0].screenX;
			} else {
				drag.pagex.end = e.pageX;
			}
			drag.left.end = getLeft(elem);
			VMM.Lib.css(elem, 'left', -(drag.pagex.start - drag.pagex.end - drag.left.start));
			
		}
		var dragMomentum = function(elem, e) {
			var drag_info = {
					left:			drag.left.end,
					left_adjust:	0,
					change: {
						x:			0
					},
					time:			(new Date().getTime() - drag.time.start) * 10,
					time_adjust:	(new Date().getTime() - drag.time.start) * 10
				},
				multiplier = 3000;
				
			if (drag.touch) {
				multiplier = 6000;
			}
			
			drag_info.change.x = multiplier * (Math.abs(drag.pagex.end) - Math.abs(drag.pagex.start));
			
			
			drag_info.left_adjust = Math.round(drag_info.change.x / drag_info.time);
			
			drag_info.left = Math.min(drag_info.left + drag_info.left_adjust);
			
			if (drag.constraint) {
				if (drag_info.left > drag.constraint.left) {
					drag_info.left = drag.constraint.left;
					if (drag_info.time > 5000) {
						drag_info.time = 5000;
					}
				} else if (drag_info.left < drag.constraint.right) {
					drag_info.left = drag.constraint.right;
					if (drag_info.time > 5000) {
						drag_info.time = 5000;
					}
				}
			}
			
			VMM.fireEvent(elem, "DRAGUPDATE", [drag_info]);

			
			if (drag_info.time > 0) {
				if (drag.touch) {
					//VMM.Lib.css(elem, '-webkit-transition-property', 'left');
					//VMM.Lib.css(elem, '-webkit-transition-duration', drag_info.time);
					//VMM.Lib.css(elem, 'left', drag_info.left);
					
					//VMM.Lib.animate(elem, drag_info.time, "easeOutQuad", {"left": drag_info.left});
					VMM.Lib.animate(elem, drag_info.time, "easeOutCirc", {"left": drag_info.left});
					//VMM.Lib.css(elem, 'webkitTransition', '');
					//VMM.Lib.css(elem, 'webkitTransition', '-webkit-transform ' + drag_info.time + 'ms cubic-bezier(0.33, 0.66, 0.66, 1)');
					//VMM.Lib.css(elem, 'webkitTransform', 'translate3d(' + drag_info.left + 'px, 0, 0)');

				} else {
					VMM.Lib.animate(elem, drag_info.time, drag.ease, {"left": drag_info.left});
				}
			}
			
		}
		var getLeft = function(elem) {
			return parseInt(VMM.Lib.css(elem, 'left').substring(0, VMM.Lib.css(elem, 'left').length - 2), 10);
		}
	}
}