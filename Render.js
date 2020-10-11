const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

class Render {
	constructor() {
		// TODO: These shouldn't be hard-coded and should change based on things like number of semesters
		this.rows = 3;
		this.cols = 4;
		
		// Test arrow
		this.arrows = [new Arrow(2, 0, 1, 2, false)];
		
		// Initialize drag-and-drop
		REDIPS.drag.init();
		REDIPS.drag.dropMode = "single";
		
		// Place svg behind the course-grid and make it the same size
		this.draw = SVG().addTo(document.getElementById("arrows"));
		this.rescale();
		this.renderArrows();
	}
	
	rescale() {
		document.querySelector("#arrows svg").style.width = document.getElementById("course-grid").offsetWidth;
		document.querySelector("#arrows svg").style.height = document.getElementById("course-grid").offsetHeight;
		document.querySelector("#arrows svg").style.marginBottom = -document.getElementById("course-grid").offsetHeight;
	}
	
	renderArrows() {
		for (let arrow of this.arrows) {
			console.log(arrow);
			// First parameter is coordinates pairs of the line
			// The move command offsets the entire line by a fixed distance from 0, 0
			this.draw.polyline([[0,0],[0,50],[50,50],...this.arrowHead(50, 100, DOWN)]).fill('none').move(100, 20).stroke({ color: '#f06', width: 2, linecap: 'round', linejoin: 'round' });
		}
	}
	
	drawLine(coords, moveX = 0, moveY = 0) {
		this.draw.polyline(coords).fill('none').move(100, 20).stroke({ color: '#f06', width: 2, linecap: 'round', linejoin: 'round' });
	}
	
	arrowHead(x, y, dir = DOWN, length = 6) {
		if (dir == UP)    return [[x, y], [x-length, y+length], [x, y], [x+length, y+length], [x, y]];
		if (dir == DOWN)  return [[x, y], [x-length, y-length], [x, y], [x+length, y-length], [x, y]];
		if (dir == LEFT)  return [[x, y], [x+length, y-length], [x, y], [x+length, y+length], [x, y]];
		if (dir == RIGHT) return [[x, y], [x-length, y-length], [x, y], [x-length, y+length], [x, y]];
	}
	
	/*
	Line positioning logic:
	 - "Channels" exist in between the courses 
	 - Each channel is the length/width of a single course, i.e. not the full size of the chart
	 - There is a fixed number of channels, most likely 5 (could maybe do just 3)
	 - When drawing a line, the middle channel is used if available, then the outermost two, then the remaining two
	 - Lines go out of the bottom of a box, then left/right to the nearest vertical channel in the direction of the class below, then down all the way, then over to the class
	 - As the lines are placed booleans are set to indicate which channels are in use so future lines don't draw on top of them
	 - Lines are also different colors to make them easier to tell apart
	 - Channels would be stored as two 3D arrays of booleans (x, y, and which of the 5 channels; one array for vertical and one for horizontal)
	 - Lines try to stay within the same channel when moving along horizontally or vertically - look for a fully open one
	*/
}

class Arrow {
	constructor(xIn, yIn, xOut, yOut, fromSide) {
		this.xIn = xIn;
		this.yIn = yIn;
		this.yOut = yOut;
		this.fromSide = fromSide;
	}
}