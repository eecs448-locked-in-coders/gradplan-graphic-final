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
		this.svg = new SVG(document.getElementById("arrows"));
		this.rescale();
		this.renderArrows();
	}
	
	rescale() {
		document.querySelector("#arrows svg").style.width = document.getElementById("course-grid").offsetWidth;
		document.querySelector("#arrows svg").style.height = document.getElementById("course-grid").offsetHeight;
		document.querySelector("#arrows svg").style.marginBottom = -document.getElementById("course-grid").offsetHeight;
	}
	
	renderArrows() {
		/*for (let arrow of this.arrows) {
			console.log(arrow);
		}*/
		
		//Test
		
		var links = this.svg.group();
		var markers = this.svg.group();
		var nodes = this.svg.group();
		
		var g1 = nodes.group().translate(300, 0).draggy();
        g1.circle(80).fill("#C2185B");

        var g2 = nodes.group().translate(100, 0).draggy();
        g2.circle(50).fill("#E91E63");

        var g3 = nodes.group().translate(200, 100).draggy();
        g3.circle(100).fill("#FF5252");

        g1.connectable({
            container: links,
            markers: markers
        }, g2).setLineColor("#5D4037");

        g2.connectable({
            padEllipse: true
        }, g3).setLineColor("#5D4037")
	}
}

class Arrow {
	constructor(xIn, yIn, xOut, yOut, fromSide) {
		this.xIn = xIn;
		this.yIn = yIn;
		this.yOut = yOut;
		this.fromSide = fromSide;
	}
}