/* TOUCH SLIDER
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.TouchSlider == 'undefined') {
	
	// VMM.TouchSlider.createSlidePanel(touch_object, move_object, w, padding, vertical, h) ;
	VMM.TouchSlider = {
		createPanel: function(touch_object, move_object, w, padding, vertical, h) {
			VMM.TouchSlider.vertical = false;
			VMM.TouchSlider.vertical = vertical;
			
			var x = padding;
			VMM.TouchSlider.width = w;
			VMM.TouchSlider.height = h;
			VMM.TouchSlider.makeTouchable(touch_object, move_object);
			/*
			if (sticky != null && sticky != "") {
				VMM.TouchSlider.sticky = sticky;
			} else {
				VMM.TouchSlider.sticky = false;
			}
			*/
			// VMM.TouchSlider.sticky = sticky;
			
		},
		
		removePanel: function(touch_object) {
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchStart, "touchstart");
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchMove, "touchmove");
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchEnd, "touchend");
		},
		
		makeTouchable: function(touch_object, move_object) {
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchStart, "touchstart", {element: move_object});
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchMove, "touchmove", {element: move_object});
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchEnd, "touchend", {element: move_object});
	    },
		onTouchStart: function(e) {
			VMM.TouchSlider.touchStart(e.data.element, e);
			e.stopPropagation();
			return true;
		},
		onTouchEnd: function(e) {
			e.stopPropagation();
			
			if (VMM.TouchSlider.sliding) {
				VMM.TouchSlider.sliding = false;
				VMM.TouchSlider.touchEnd(e.data.element, e);
				return false;
			} else {
				return true;
			}
			
		},
		onTouchMove: function(e) {
			VMM.TouchSlider.touchMove(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		getLeft: function(elem) {
			return parseInt(VMM.Element.css(elem, 'left').substring(0, VMM.Element.css(elem, 'left').length - 2), 10);
		},
		getTop: function(elem) {
			return parseInt(VMM.Element.css(elem, 'top').substring(0, VMM.Element.css(elem, 'top').length - 2), 10);
		},
	    touchStart: function(elem, e) {
			
			VMM.Element.css(elem, '-webkit-transition-duration', '0');
			
			VMM.TouchSlider.startX = e.originalEvent.touches[0].screenX;
			VMM.TouchSlider.startY = e.originalEvent.touches[0].screenY;
			
			VMM.TouchSlider.startLeft = VMM.TouchSlider.getLeft(elem);
			VMM.TouchSlider.startTop = VMM.TouchSlider.getTop(elem);
			
			VMM.TouchSlider.touchStartTime = new Date().getTime();

	    },
		touchEnd: function(elem, e) {
			if (VMM.TouchSlider.getLeft(elem) > 0) {
				
				//This means they dragged to the right past the first item
				
				if (VMM.TouchSlider.vertical) {
					VMM.Element.animate(elem, 1000, "", {"top": 0});
				} else {
					VMM.Element.animate(elem, 1000, "", {"left": 0});
				}
				
				VMM.TouchSlider.startX = null;
				VMM.TouchSlider.startY = null;
				
				VMM.fireEvent(elem, "TOUCHUPDATE", [0]);
				
			} else {
				//This means they were just dragging within the bounds of the grid and we just need to handle the momentum and snap to the grid.
				VMM.TouchSlider.slideMomentum(elem, e);
	         }
	    },
		slideMomentum: function(elem, e) {
			var slideAdjust = (new Date().getTime() - VMM.TouchSlider.touchStartTime) * 10;
			var timeAdjust = slideAdjust;
			
			var left = VMM.TouchSlider.getLeft(elem);
			var top = VMM.TouchSlider.getTop(elem);
			
			var changeX = 6000 * (Math.abs(VMM.TouchSlider.startLeft) - Math.abs(left));
			var changeY = 6000 * (Math.abs(VMM.TouchSlider.startTop) - Math.abs(top));
			
			slideAdjust = Math.round(changeX / slideAdjust);
			slideAdjustY = Math.round(changeY / slideAdjust);

			var newLeft = slideAdjust + left;
			var newTop = slideAdjustY + top;
			
			var y = newTop % VMM.TouchSlider.height;
			var t = newLeft % VMM.TouchSlider.width;
			
			
			var _r_object = {
				top: Math.min(0, newTop),
				left: Math.min(0, newLeft),
				time: timeAdjust
			}
			VMM.fireEvent(elem, "TOUCHUPDATE", [_r_object]);
			/*
			if (VMM.TouchSlider.sticky) {
				trace("sticky");
				if ((Math.abs(t)) > ((VMM.TouchSlider.width / 2))) {
					//Show the next cell
					newLeft -= (VMM.TouchSlider.width - Math.abs(t));
				} else {
		             //Stay on the current cell
					newLeft -= t;
				}
				
				VMM.fireEvent(elem, "TOUCHUPDATE", [Math.min(0, newLeft)]);
				
			} else {
				trace("not sticky");
				//VMM.TouchSlider.doSlide(elem, Math.min(0, newLeft), '0.5s');
				VMM.Element.animate(elem, 500, "", {"left": Math.min(0, newLeft)});
			}
			*/
			
			VMM.TouchSlider.startX = null;
			VMM.TouchSlider.startY = null;
			
	    },
		doSlide: function(elem, x, duration) {
			VMM.Element.css(elem, '-webkit-transition-property', 'left');
			VMM.Element.css(elem, '-webkit-transition-duration', duration);
			VMM.Element.css(elem, 'left', x);
		},
		touchMove: function(elem, e) {
			
			if (!VMM.TouchSlider.sliding) {
				//elem.parent().addClass('sliding');
			}

			VMM.TouchSlider.sliding = true;
			
			if (VMM.TouchSlider.vertical) {
				
				if (VMM.TouchSlider.startY > e.originalEvent.touches[0].screenY) {
					VMM.Element.css(elem, 'top', -(VMM.TouchSlider.startY - e.originalEvent.touches[0].screenY - VMM.TouchSlider.startTop));
					VMM.TouchSlider.slidingTop = true;
				} else {
					var top = (e.originalEvent.touches[0].screenY - VMM.TouchSlider.startY + VMM.TouchSlider.startTop);
					VMM.Element.css(elem, 'top', -(VMM.TouchSlider.startY - e.originalEvent.touches[0].screenY - VMM.TouchSlider.startTop));
					VMM.TouchSlider.slidingTop = false;
				}
				
			} else {
				
				if (VMM.TouchSlider.startX > e.originalEvent.touches[0].screenX) {
					VMM.Element.css(elem, 'left', -(VMM.TouchSlider.startX - e.originalEvent.touches[0].screenX - VMM.TouchSlider.startLeft));
					VMM.TouchSlider.slidingLeft = true;
				} else {
					var left = (e.originalEvent.touches[0].screenX - VMM.TouchSlider.startX + VMM.TouchSlider.startLeft);
					VMM.Element.css(elem, 'left', -(VMM.TouchSlider.startX - e.originalEvent.touches[0].screenX - VMM.TouchSlider.startLeft));
					VMM.TouchSlider.slidingLeft = false;
				}
				
			}
			
			
		}
	}
}