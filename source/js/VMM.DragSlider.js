/* DRAG SLIDER
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.DragSlider == 'undefined') {
	// VMM.DragSlider.createSlidePanel(drag_object, move_object, w, padding, sticky);
	// VMM.DragSlider.cancelSlide();
	VMM.DragSlider = {
		createPanel: function(drag_object, move_object, w, padding, sticky) {
			

			
			var x = padding;
			VMM.DragSlider.width = w;
			VMM.DragSlider.makeDraggable(drag_object, move_object);
			VMM.DragSlider.drag_elem = drag_object;
			/*
			if (sticky != null && sticky != "") {
				VMM.TouchSlider.sticky = sticky;
			} else {
				VMM.TouchSlider.sticky = false;
			}
			*/
			VMM.DragSlider.sticky = sticky;
		},
		makeDraggable: function(drag_object, move_object) {
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragStart, "mousedown", {element: move_object, delement: drag_object});
			//VMM.bindEvent(drag_object, VMM.DragSlider.onDragMove, "mousemove", {element: move_object});
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragEnd, "mouseup", {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragLeave, "mouseleave", {element: move_object, delement: drag_object});
	    },
		cancelSlide: function(e) {
			VMM.unbindEvent(VMM.DragSlider.drag_elem, VMM.DragSlider.onDragMove, "mousemove");
			//VMM.DragSlider.drag_elem.preventDefault();
			//VMM.DragSlider.drag_elem.stopPropagation();
			return true;
		},
		onDragLeave: function(e) {

			VMM.unbindEvent(e.data.delement, VMM.DragSlider.onDragMove, "mousemove");
			e.preventDefault();
			e.stopPropagation();
			return true;
		},
		onDragStart: function(e) {
			VMM.DragSlider.dragStart(e.data.element, e.data.delement, e);
			
			e.preventDefault();
			e.stopPropagation();
			return true;
		},
		onDragEnd: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (VMM.DragSlider.sliding) {
				VMM.DragSlider.sliding = false;
				VMM.DragSlider.dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
			
		},
		onDragMove: function(e) {
			VMM.DragSlider.dragMove(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		dragStart: function(elem, delem, e) {
			
			VMM.DragSlider.startX = e.pageX;
			
			VMM.DragSlider.startLeft = VMM.DragSlider.getLeft(elem);
			VMM.DragSlider.dragStartTime = new Date().getTime();
			VMM.DragSlider.dragWidth = VMM.Element.width(delem);
			
			// CANCEL CURRENT ANIMATION IF ANIMATING
			var _newx = Math.round(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft);
			
			VMM.Element.stop(elem);
			VMM.bindEvent(delem, VMM.DragSlider.onDragMove, "mousemove", {element: elem});

	    },
		dragEnd: function(elem, delem, e) {
			VMM.unbindEvent(delem, VMM.DragSlider.onDragMove, "mousemove");
			//VMM.DragSlider.dragMomentum(elem, e);
			if (VMM.DragSlider.getLeft(elem) > 0) {
				//(VMM.DragSlider.dragWidth/2)
				//This means they dragged to the right past the first item
				//VMM.Element.animate(elem, 1000, "linear", {"left": 0});
				
				//VMM.fireEvent(elem, "DRAGUPDATE", [0]);
			} else {
				//This means they were just dragging within the bounds of the grid and we just need to handle the momentum and snap to the grid.
				VMM.DragSlider.dragMomentum(elem, e);
	         }
		},
		dragMove: function(elem, e) {
			if (!VMM.DragSlider.sliding) {
				//elem.parent().addClass('sliding');
			}
			
			VMM.DragSlider.sliding = true;
			if (VMM.DragSlider.startX > e.pageX) {
				//Sliding to the left
				VMM.Element.css(elem, 'left', -(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft));
				VMM.DragSlider.slidingLeft = true;
			} else {
				//Sliding to the right
				var left = (e.pageX - VMM.DragSlider.startX + VMM.DragSlider.startLeft);
				VMM.Element.css(elem, 'left', -(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft));
				VMM.DragSlider.slidingLeft = false;
			}
		},
		dragMomentum: function(elem, e) {
			var slideAdjust = (new Date().getTime() - VMM.DragSlider.dragStartTime) * 10;
			var timeAdjust = slideAdjust;
			var left = VMM.DragSlider.getLeft(elem);

			var changeX = 6000 * (Math.abs(VMM.DragSlider.startLeft) - Math.abs(left));
			//var changeX = 6000 * (VMM.DragSlider.startLeft - left);
			slideAdjust = Math.round(changeX / slideAdjust);
			
			var newLeft = left + slideAdjust;
			
			var t = newLeft % VMM.DragSlider.width;
			//left: Math.min(0, newLeft),
			var _r_object = {
				left: Math.min(newLeft),
				time: timeAdjust
			}
			
			VMM.fireEvent(elem, "DRAGUPDATE", [_r_object]);
			var _ease = "easeOutExpo";
			if (_r_object.time > 0) {
				VMM.Element.animate(elem, _r_object.time, _ease, {"left": _r_object.left});
			};
			
			
			//VMM.DragSlider.startX = null;
		},
		getLeft: function(elem) {
			return parseInt(VMM.Element.css(elem, 'left').substring(0, VMM.Element.css(elem, 'left').length - 2), 10);
		}
	
	}
}