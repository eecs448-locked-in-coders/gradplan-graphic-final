const COURSE_BANK_COLS = 3;

class Executive {
	constructor() {
		this.arrowRender = new ArrowRender();
		
		// Add tooltips to courses
		$('#redips-drag').tooltip({selector: '[data-toggle="tooltip"]'})
		
		// Populate options for major
		for (let major of MAJORS) {
			let option = document.createElement("option");
			option.text = major.major_name;
			option.value = major.major_name;
			document.getElementById("majorSelect").add(option);
		}
		
		// Populate options for starting semester
		let thisYear = new Date().getFullYear();
		for (let year = thisYear; year >= thisYear-3; year--) {
			for (let season of [FALL, SPRING]) {
				let option = document.createElement("option");
				option.text = SEASON_NAMES[season] + " " + year;
				option.value = year + "-" + season;
				document.getElementById("startSemesterSelect").add(option);
			}
		}
		
		// Initialize plan when done is clicked
		document.getElementById("done").addEventListener("click", () => {
			let [year, season] = document.getElementById("startSemesterSelect").value.split('-').map(Number);
			let major = document.getElementById("majorSelect").value;

			document.getElementById("welcome").style.display = "none";
			document.getElementById("add-semester").style.display = "";
			this.plan = new Plan(major, season, year);
			this.update();
			
			// Set up adding semesters - add the summers between the automatic semesters
			for (let tmpYear = year; tmpYear < year+4; tmpYear++) {
				let option = document.createElement("option");
				option.text = SEASON_NAMES[SUMMER] + " " + tmpYear;
				option.value = tmpYear + "-" + SUMMER;
				document.getElementById("addSemesterSelect").add(option);
			}
			
			// Option to add the next few semsters
			year += season == FALL ? 4 : 3;
			season = 2-season;
			for (let semester = 1; semester <= 9; semester++) {
				season++;
				if (season >= 3) {
					season -= 3;
					year++;
				}
				let option = document.createElement("option");
				option.text = SEASON_NAMES[season] + " " + year;
				option.value = year + "-" + season;
				document.getElementById("addSemesterSelect").add(option);
			}
		});

		// Initialize drag-and-drop to move courses
		REDIPS.drag.dropMode = "single";
		REDIPS.drag.event.clicked = targetCell => {
			// Remove tooltip while dragging
			delete targetCell.firstElementChild.dataset.toggle;
			$(targetCell.firstElementChild).tooltip('dispose');
		};
		REDIPS.drag.event.dropped = targetCell => {
			// Clear all notifications
			for (let id of ["notifications", "print-notifications"]) {
				let list = document.getElementById(id);
				while (list.firstChild) list.removeChild(list.firstChild);
			}
			
			let course = this.plan.course_code_to_object(targetCell.firstElementChild.dataset["course"]);
			this.plan.remove_course(course); // Remove course from wherever it is
			if (targetCell.dataset["bank"] == "course") {
				this.plan.course_bank.push(course);
			}
			else if (targetCell.dataset["bank"] == "transfer") {
				this.plan.transfer_bank.push(course);
			}
			else {
				this.plan.add_course(targetCell.dataset["y"], targetCell.dataset["x"], course);
			}
			this.update();
		};
		
		// Adding a semester
		document.getElementById('add-semester-btn').addEventListener('click', () => {
			let [year, season] = document.getElementById("addSemesterSelect").value.split('-').map(Number);
			
			// Remove semester from dropdown
			document.getElementById("addSemesterSelect").remove(document.getElementById("addSemesterSelect").selectedIndex);
			document.getElementById("addSemesterSelect").selectedIndex = 0;
			
			this.plan.add_semester(season, year);
			this.update();
		});

		// Test plan
		//this.createTestPlan();
	}
	
	// Main function for rerendering the screen and updating errors
	update() {
		// Update course bank and transfer credits
		this.renderBank("course-bank", this.plan.course_bank);
		this.renderBank("transfer-bank", this.plan.transfer_bank);
		document.getElementById("print-course-bank").innerText = this.plan.course_bank.map(course => course.course_code).join(", ") || "None";
		document.getElementById("print-transfer-bank").innerText = this.plan.transfer_bank.map(course => course.course_code).join(", ") || "None";
		
		// Update main semester grid
		this.renderCourseGrid(); // Must call before renderArrows
		let arrows = this.plan.generate_arrows();
		this.arrowRender.renderArrows(arrows);
		REDIPS.drag.init(); // Updates which elements have drag-and-drop
		//$('[data-toggle="tooltip"]').tooltip({trigger : 'hover'}); // Enable tooltips
		//$('[data-toggle="tooltip"]').on('click', function () { $(this).tooltip('hide'); });
		
		// Update the credit hour displays
		for (let semester of this.plan.semesters) {
			let credit_hours = semester.get_credit_hour();
			document.getElementById("ch" + semester.semester_year + "-" + semester.semester_season).innerText = credit_hours;
			if (credit_hours > MAX_HOURS) // Add excessive hour warnings
				this.add_error("EXCESS HOURS: " + semester.season_name() + " " + semester.semester_year + ": You are taking more than " + MAX_HOURS +
					" credit hours. You will need to fill out a waiver.\n");
		}
		
		// Check for invalid placements
		for (let arrow of arrows) {
			if (!arrow.fromSide && arrow.yIn >= arrow.yOut) { // Invalid prerequisite
				this.add_error("INVALID COURSE: " + this.plan.get_course(arrow.yIn, arrow.xIn).course_code 
					+ " is a prerequisite of " + this.plan.get_course(arrow.yOut, arrow.xOut).course_code + "\n");
			}
			else if (arrow.fromSide && arrow.yIn > arrow.yOut) { // Invalid corequisite
				this.add_error("INVALID COURSE: " + this.plan.get_course(arrow.yIn, arrow.xIn).course_code 
					+ " is a corequisite of " + this.plan.get_course(arrow.yOut, arrow.xOut).course_code + "\n");
			}
		}
	}

	renderBank(html_id, arrCourse) {
		let grid = document.getElementById(html_id);
		while (grid.firstChild) grid.removeChild(grid.firstChild); // Clear bank
		let tr;
		let numCoursesInCurrentRow = COURSE_BANK_COLS;
		// At least one more cell than the number of courses, then round up to multiple of 3
		let totalCells = Math.ceil((arrCourse.length+1)/COURSE_BANK_COLS)*COURSE_BANK_COLS;
		for (let i = 0; i < totalCells; i++) {
			if (numCoursesInCurrentRow == COURSE_BANK_COLS) {
				tr = document.createElement("tr");
				grid.appendChild(tr);
				numCoursesInCurrentRow = 0;
			}
			let td = document.createElement("td");
			td.dataset["bank"] = (html_id == "course-bank") ? "course" : "transfer";
			if (arrCourse[i]) td.innerHTML = arrCourse[i].to_html();
			tr.appendChild(td);
			numCoursesInCurrentRow++;
		}
	}

	// Redrawing the course grid should only be needed after drastic changes (e.g. removing a semester)
	// The rest of the time, the users takes care of these steps by moving courses around
	renderCourseGrid() {
		let grid = document.getElementById("course-grid");
		while (grid.firstChild) grid.removeChild(grid.firstChild); // Clear grid

		let cols = this.plan.get_longest() + 1; // +1 leaves an empty column to add another course to a semester
		for (let i = 0; i < this.plan.semesters.length; i++) {
			let semester = this.plan.semesters[i];
			let tr = document.createElement("tr");

			let th = document.createElement("th");
			th.className = "redips-mark";
			th.innerHTML = semester.semester_year + " " + semester.season_name() + "<br><span style='font-weight:normal'><span id='ch"+semester.semester_year+"-"+semester.semester_season+"'>0</span> credit hours</span>";
			tr.appendChild(th);

			for (let j = 0; j < cols; j++) {
				let td = document.createElement("td");
				if (semester.semester_courses[j] != undefined) {
					td.innerHTML = semester.semester_courses[j].to_html();
				}
				td.dataset["x"] = j;
				td.dataset["y"] = i;
				tr.appendChild(td);
			}

			grid.appendChild(tr);
		}
		
		this.arrowRender.resize(this.plan.semesters.length, cols);
	}
	
	add_error(msg) {
		for (let id of ["notifications", "print-notifications"]) {
			let ul = document.getElementById(id);
			let li = document.createElement("li");
			li.appendChild(document.createTextNode(msg));
			ul.appendChild(li);
		}
	}
	
	createTestPlan() {
		document.getElementById("welcome").style.display = "none";
		this.plan = new Plan("Computer Science", FALL, 2018);
		this.plan.add_course(0, 1, this.plan.course_code_to_object("EECS 168"));
		this.plan.add_course(0, 2, this.plan.course_code_to_object("EECS 140"));
		this.plan.add_course(1, 1, this.plan.course_code_to_object("MATH 125"));
		this.plan.add_course(1, 3, this.plan.course_code_to_object("GE 2.2"));
		this.plan.add_course(2, 0, this.plan.course_code_to_object("EECS 268"));
		this.plan.add_course(2, 1, this.plan.course_code_to_object("PHSX 210"));
		this.plan.add_course(2, 2, this.plan.course_code_to_object("EECS 388"));
		this.plan.add_course(2, 3, this.plan.course_code_to_object("PHSX 216"));
		this.update();
	}
}
