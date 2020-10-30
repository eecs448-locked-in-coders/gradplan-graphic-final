const COURSE_BANK_COLS = 3;

class Executive {
	constructor() {
		this.arrowRender = new ArrowRender();
		
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
				option.text = "Summer " + tmpYear;
				option.value = tmpYear + "-1";
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

		// Initialize drag-and-drop to move courses within plan
		REDIPS.drag.dropMode = "single";
		REDIPS.drag.event.dropped = targetCell => {
			// Clear all notifications
			for (let id of ["notifications", "print-notifications"]) {
				let list = document.getElementById(id);
				while (list.firstChild) list.removeChild(list.firstChild);
			}
			
			let course = this.plan.course_id_to_object(targetCell.firstElementChild.dataset["course"]);
			this.plan.remove_course(course); // Remove course from wherever it is
			if (targetCell.dataset["bank"] == "course") {
				this.plan.course_bank.push(course);
			}
			else if (targetCell.dataset["bank"] == "transfer") {
				this.plan.transfer_bank.push(course);
			}
			else {
				this.plan.semesters[targetCell.dataset["y"]].add_course(course, targetCell.dataset["x"]);
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
	
	// Main function for rerendering the screen
	update() {
		this.renderBank("course-bank", this.plan.course_bank);
		this.renderBank("transfer-bank", this.plan.transfer_bank);
		this.renderCourseGrid(); // Must call before renderArrows
		this.arrowRender.renderArrows(this.plan.generate_arrows());
		REDIPS.drag.init(); // Updates which elements have drag-and-drop
		
		// Update the credit hours
		for (let semester of this.plan.semesters) {
			document.getElementById("ch" + semester.semester_year + "-" + semester.semester_season).innerText = semester.get_credit_hour();
		}
		
		// Also update the print displays
		document.getElementById("print-course-bank").innerText = this.plan.course_bank.map(course => course.course_code).join(", ") || "None";
		document.getElementById("print-transfer-bank").innerText = this.plan.transfer_bank.map(course => course.course_code).join(", ") || "None";
	}

	renderBank(html_id, arr_course) {
		let grid = document.getElementById(html_id);
		while (grid.firstChild) grid.removeChild(grid.firstChild); // Clear bank
		let tr;
		let numCoursesInCurrentRow = COURSE_BANK_COLS;
		for (let course of arr_course) {
			if (numCoursesInCurrentRow == COURSE_BANK_COLS) {
				tr = document.createElement("tr");
				grid.appendChild(tr);
				numCoursesInCurrentRow = 0;
			}
			let td = document.createElement("td");
			td.dataset["bank"] = (html_id == "course-bank")?"course" : "transfer";
			td.innerHTML = course.to_html();
			tr.appendChild(td);
			numCoursesInCurrentRow++;
		}
		
		// Add an empty row if no blank spaces in current one
		if (numCoursesInCurrentRow == COURSE_BANK_COLS) {
			tr = document.createElement("tr");
			grid.appendChild(tr);
			numCoursesInCurrentRow = 0;
		}
		for (var i = numCoursesInCurrentRow; i < COURSE_BANK_COLS; i++) {
			let td = document.createElement("td");
			td.dataset["bank"] = (html_id == "course-bank") ? "course" : "transfer";
			tr.appendChild(td);
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
	
	createTestPlan() {
		document.getElementById("welcome").style.display = "none";
		this.plan = new Plan("Computer Science", FALL, 2018);
		this.plan.semesters[0].semester_courses[1] = this.plan.course_id_to_object("EECS 168");
		this.plan.semesters[0].semester_courses[2] = this.plan.course_id_to_object("EECS 140");
		this.plan.semesters[1].semester_courses[1] = this.plan.course_id_to_object("MATH 125");
		this.plan.semesters[1].semester_courses[3] = this.plan.course_id_to_object("GE 2.2");
		this.plan.semesters[2].semester_courses[0] = this.plan.course_id_to_object("EECS 268");
		this.plan.semesters[2].semester_courses[1] = this.plan.course_id_to_object("PHSX 210");
		this.plan.semesters[2].semester_courses[2] = this.plan.course_id_to_object("EECS 388");
		this.plan.semesters[2].semester_courses[3] = this.plan.course_id_to_object("PHSX 216");
		this.update();
	}
}
