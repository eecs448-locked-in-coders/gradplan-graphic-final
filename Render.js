const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

// Position of all arrows relative to top-left of svg
const LEFT_OFFSET = 120; // Offset due to the column of the chart with the semester names
const TOP_OFFSET = -2; // Currently zero, but of padding is added for outside channels may increase

const NUM_CHANNELS = 5;

const TD_WIDTH = 120;
const TD_HEIGHT = 80;
const COURSE_WIDTH = 95;
const COURSE_HEIGHT = 50;

// The thickness of each individual channel (line drawn in middle)
const HORIZ_CHANNEL_SIZE = (TD_HEIGHT-COURSE_HEIGHT)/NUM_CHANNELS;
const VERT_CHANNEL_SIZE = (TD_WIDTH-COURSE_WIDTH)/NUM_CHANNELS;

class Render {
	constructor() {
		// Rows and columns of courses in the grid (not counting column of semester names)
		// TODO: These shouldn't be hard-coded and should change based on things like number of semesters
		this.rows = 3;
		this.cols = 4;
		
		// Initialize channels (note there is one more set of channels than the number of rows/cols as the channels go between them)
		this.vertChannels = [];
		this.horizChannels = [];
		for (var row = 0; row <= this.rows; row++) {
			this.vertChannels[row] = [];
			this.horizChannels[row] = [];
			for (var col = 0; col <= this.cols; col++) {
				this.vertChannels[row][col] = [];
				this.horizChannels[row][col] = [];
				for (var chan = 0; chan < NUM_CHANNELS; chan++) {
					this.vertChannels[row][col][chan] = false;
					this.horizChannels[row][col][chan] = false;
				}
			}
		}
		
		// Prerequisite test arrows from and to hard-coded positions
		this.arrows = [
			new Arrow(0, 1, 3, 2, false), // EECS 140 to EECS 388
			new Arrow(0, 0, 2, 2, false), // EECS 168 to EECS 268
			
		];
		
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
			// TODO: Handle the special case of the course directly below (should be simple) and only one semester below (currently should work, but wastes a vertChannel)
			// TODO: Nodes can currently overlap, which is ambiguous. Possible solution is rounded or diagonal corners instead of right turns at nodes.
			
			// Find the coordinates of the channels the arrow will go through
			let firstChannelY = this.findHorizChannel(arrow.xIn+.5, ...arrow.node1());
			let secondChannelX = this.findVertChannel(...arrow.node1(), arrow.node2()[1]);
			let thirdChannelY = this.findHorizChannel(arrow.node2()[0], arrow.xOut+.5, arrow.node2()[1]);
			
			let path = [
				arrow.startPoint(), // Start below middle of starting course
				[(arrow.xIn+.5)*TD_WIDTH, firstChannelY], // Enter first channel
				[secondChannelX, firstChannelY], // Traverse along first channel to node1, the junction between channels 1 and 2
				[secondChannelX, thirdChannelY], // Traverse down second channel to node2, the junction between channels 2 and 3
				[(arrow.xOut+.5)*TD_WIDTH, thirdChannelY], // Traverse along third channel to the point above the ending course
				...this.arrowHead(...arrow.endPoint(), DOWN) // Connect to ending course with an arrowhead
			];
			
			// Find the minimum x and y coordinates in the path (needed to properly offset the arrow)
			let mins = path.reduce((acc, val) => [
				val[0] < acc[0] ? val[0] : acc[0], 
				val[1] < acc[1] ? val[1] : acc[1]
			], [Number.MAX_VALUE, Number.MAX_VALUE]);
			
			this.draw.polyline(path).fill('none').move(LEFT_OFFSET+mins[0], TOP_OFFSET+mins[1]).stroke({ color: '#f06', width: 2, linecap: 'round', linejoin: 'round' });
		}
	}
	
	// Return the y coordinate (pixel) to draw the channel at
	findHorizChannel(startX, endX, y) {
		// IMPORTANT TODO: The loops here currently don't work if endX < startX (arrow going left). Need to flip startX/endX in that case or something.
		
		// Find an available channel (all segments along length of line available)
		var chan;
		for (chan = 0; chan < NUM_CHANNELS; chan++) {
			var channelValid = true;
			for (var col = Math.floor(startX); col < Math.ceil(endX); col++) {
				// if this segment of the channel is already taken
				if (this.horizChannels[y][col][chan]) { 
					channelValid = false;
					break;
				}
			}
			// Available channel found
			if (channelValid) break;
		}
		
		// Mark channel as unavailable
		for (var col = Math.floor(startX); col < Math.ceil(endX); col++) {
			this.horizChannels[y][col][chan] = true;
		}
		
		// Y coordinate pixel of the channel
		return (chan - ((NUM_CHANNELS-1)/2)) * HORIZ_CHANNEL_SIZE + y*TD_HEIGHT;
	}
	
	findVertChannel(x, startY, endY) {
		// TODO: The same problem as findHorizChannel for upward pointing arrows (though this is much less common)
		
		// Find an available channel (all segments along length of line available)
		var chan;
		for (chan = 0; chan < NUM_CHANNELS; chan++) {
			var channelValid = true;
			for (var row = Math.floor(startY); row < Math.ceil(endY); row++) {
				// if this segment of the channel is already taken
				if (this.vertChannels[row][x][chan]) { 
					channelValid = false;
					break;
				}
			}
			// Available channel found
			if (channelValid) break;
		}
		
		// Mark channel as unavailable
		for (var row = Math.floor(startY); row < Math.ceil(endY); row++) {
			this.vertChannels[row][x][chan] = true;
		}
		
		// X coordinate pixel of the channel
		return (chan - ((NUM_CHANNELS-1)/2)) * VERT_CHANNEL_SIZE + x*TD_WIDTH;
	}
	
	arrowHead(x, y, dir = DOWN, length = 4) {
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
	 - Lines try to stay within the same channel when moving along horizontally or vertically - look for a fully open one (findChannel function, takes start and end/dir/length)
	 - Process of drawing a prereq line: 
	     - Draw point below course, 
		 - findChannel(horizontal left or right, starting at a .5 value and only going a distace of .5), 
		 - findChannel(vertical usually down), 
		 - findChannel(horizontal left or right, ending at a .5 value and going a variable distance to reach course)
		 - draw arrowHead
	 - When starting/ending at a .5 value, actually have findChannel offset the coordinate in the direction of travel to cause a 45 degree diagonal line from the terminal point
	 - If I want to allow shard lines for a course (like colored lines in draw.io), the 3D arrays would store which course/node the line is coming from instead of booleans)
	*/
}

class Arrow {
	constructor(xIn, yIn, xOut, yOut, fromSide) {
		this.xIn = xIn;
		this.yIn = yIn;
		this.xOut = xOut;
		this.yOut = yOut;
		this.fromSide = fromSide;
	}
	
	// Pixels of start point
	startPoint() {
		return [(this.xIn+.5)*TD_WIDTH, (this.yIn+.5)*TD_HEIGHT + COURSE_HEIGHT/2];
	}
	
	// Pixels of end point
	endPoint() {
		return [(this.xOut+.5)*TD_WIDTH, (this.yOut+.5)*TD_HEIGHT - COURSE_HEIGHT/2];
	}
	
	// Grid coordinates of junction point between first and second channels (diagonally down-left or down-right from starting course)
	node1() {
		return [(this.xOut >= this.xIn) ? this.xIn+1 : this.xIn, this.yIn+1];
	}
	
	// Grid coordinates of the junction point between the second and third channels (below node1)
	node2() {
		return [(this.xOut >= this.xIn) ? this.xIn+1 : this.xIn, this.yOut];
	}
}