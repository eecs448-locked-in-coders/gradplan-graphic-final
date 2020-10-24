class Executive {
	constructor() {
		// Initialize drag-and-drop
		REDIPS.drag.init();
		REDIPS.drag.dropMode = "single";
		REDIPS.drag.event.dropped = targetCell => console.log(targetCell);
		
		this.render = new Render(3, 4); // TODO hard-coded rows/cols
		this.createTestPlan();
		this.createCourseGrid();
	}
	
	createTestPlan() {
		this.render.resize(3, 4);
		this.plan = new Plan("Computer Science", FALL, 2018);
		
		// Test arrows from and to hard-coded course positions
		this.render.renderArrows([
			new Arrow(1, 0, 0, 2, false), // EECS 168 to EECS 268
			new Arrow(1, 0, 2, 2, false), // EECS 168 to EECS 388
			new Arrow(2, 0, 2, 2, false), // EECS 140 to EECS 388
			new Arrow(1, 1, 1, 2, true),  // MATH 126 to PHSX 210 (corequisite)
			new Arrow(1, 2, 3, 2, true),  // PHSX 210 to PHSX 216
		]);
	}
	
	createCourseGrid() {
		for (let semester of this.plan.semesters) {
			console.log(semester);
		}
	}
}