const COURSE_BANK_COLS = 3;

class Executive {
	constructor() {
		this.render = new Render();
		// Initialize plan when done is clicked
		document.getElementById('done').addEventListener('click', () => {
			let value = document.getElementById('yearSelect').value;
			let year = parseInt(value.substring(0,4));
			let season = value.substring(4,5) == "S" ? SPRING : FALL;
			let major = document.getElementById('majorSelect').value;

			document.getElementById("welcome").style.display = "none";
			this.plan = new Plan(major, season, year);
			this.renderBank("course-bank", this.plan.course_bank);
			this.renderBank("transfer-bank", this.plan.transfer_bank);
			this.renderCourseGrid();
			
			document.getElementById("add-semester").style.display = "";
			
			// Set up adding semesters - add the summers between the automatic semesters
			for (let tmpYear = year; tmpYear < year+4; tmpYear++) {
				let option = document.createElement("option");
				option.text = "Summer " + tmpYear;
				option.value = tmpYear + "-1";
				document.getElementById("addSemesterSelect").add(option);
			}
			
			// Add the next few semsters
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
			for (let list of ["notifications", "notifications2"]) {
				list = document.getElementById(list);
				while (list.firstChild) list.removeChild(list.firstChild);
			}
			
			let course = this.plan.course_id_to_object(targetCell.firstElementChild.dataset["course"]);
			let new_x = targetCell.dataset["x"];
			let new_y = targetCell.dataset["y"];
			let old_longest = this.plan.get_longest();
			this.plan.remove_course(course);
			if (targetCell.dataset["bank"] == "course") {
				this.plan.course_bank.push(course);
			}
			else if (targetCell.dataset["bank"] == "transfer") {
				this.plan.transfer_bank.push(course);
			}
			else {
				this.plan.semesters[new_y].add_course(course, new_x);
				// Rerender course grid if longest semester changed
				if (this.plan.get_longest() != old_longest) this.renderCourseGrid();
			}
			this.renderBank("course-bank", this.plan.course_bank);
			this.renderBank("transfer-bank", this.plan.transfer_bank);
			this.renderArrows();
		};
		
		// Adding a semester
		document.getElementById('add-semester-btn').addEventListener('click', () => {
			let semester = document.getElementById("addSemesterSelect").value.split('-');
			
			// Remove semester from dropdown
			document.getElementById("addSemesterSelect").remove(document.getElementById("addSemesterSelect").selectedIndex);
			document.getElementById("addSemesterSelect").selectedIndex = 0;
			
			this.plan.add_semester(parseInt(semester[1]), parseInt(semester[0]));
			this.renderCourseGrid();
		});

		// Test plan
		//this.createTestPlan();
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
		this.renderBank("course-bank", this.plan.course_bank);
		this.renderBank("transfer-bank", this.plan.transfer_bank);
		this.renderCourseGrid();
	}

    renderBank(html_id, arr_course) {
			let grid = document.getElementById(html_id);
			while (grid.firstChild) grid.removeChild(grid.firstChild); //Clear the grid.
			let tr;
			let numCoursesInCurrentRow = COURSE_BANK_COLS;
			for (let course of arr_course) {
				if (numCoursesInCurrentRow == COURSE_BANK_COLS) {
					tr = document.createElement("tr");
					grid.appendChild(tr);
					numCoursesInCurrentRow = 0;
				}
				let td = document.createElement("td");
				td.dataset["bank"] = (html_id == "course-bank")?"course":"transfer";
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
			for (var i=numCoursesInCurrentRow; i<COURSE_BANK_COLS; i++) {
				let td = document.createElement("td");
				td.dataset["bank"] = (html_id == "course-bank")?"course":"transfer";
				tr.appendChild(td);
			}
			
			REDIPS.drag.init(); // Updates which elements have drag-and-drop
    }

	// Redrawing the course grid should only be needed after drastic changes (e.g. removing a semester)
	// The rest of the time, the users takes care of these steps by moving courses around
	renderCourseGrid() {
		let grid = document.getElementById("course-grid");
		// Clear grid
		while (grid.firstChild) grid.removeChild(grid.firstChild);

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
		REDIPS.drag.init(); // Updates which elements have drag-and-drop
		this.render.resize(this.plan.semesters.length, cols);

		this.renderArrows(); // Will always need to render arrows after rendering course grid
	}

	renderArrows() {
		this.render.renderArrows(this.plan.generate_arrows());
		
		// Also update the credit hours
		for (let semester of this.plan.semesters) {
			document.getElementById("ch" + semester.semester_year + "-" + semester.semester_season).innerText = semester.get_credit_hour();
		}
		
		// Also update the print displays
		document.getElementById("print-course-bank").innerText = this.plan.course_bank.map(course => course.course_code).join(", ") || "None";
		document.getElementById("print-transfer-bank").innerText = this.plan.transfer_bank.map(course => course.course_code).join(", ") || "None";
	}
}
