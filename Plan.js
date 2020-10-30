//Major, list of semester objects, list of transfer/exempt courses
const SPRING = 0, SUMMER = 1, FALL = 2;
const MIN_COLS = 3; // Minimum number of columns to put courses in
class Plan {

	/*
		major_name = major name
		start_semester = int 0,1,2
		start_year = int, year
		semesters = [semester, semester, ...]
		course_bank = [course, course, ...]
	*/
	constructor(major_name, start_season, start_year) {
		this.major = MAJORS.find(major => major.major_name = major_name);
		this.semesters = [];
		this.course_bank = [];
		this.transfer_bank = [];
		this.fill_course_bank();
		for (var i = 0; i < 4; i++) {
			//Makes 8 semester of fall/spring, flips between fall and spring
			//ONLY WOKRS IF YOU START AT FALL/SPRING
			this.semesters.push(new Semester(start_season, start_year, []));
			if (start_season == FALL) start_year++;
			this.semesters.push(new Semester(2-start_season, start_year, []));
			if (start_season == SPRING) start_year++;
		}

	}

	find_course(course_code) {
		let coords;
		this.semesters.forEach((semester, y) => {
			semester.semester_courses.forEach((course, x) => {
				if (course_code == course.course_code) coords = [y, x];
			});
		});
		return coords;
	}

	remove_course(course) {
		//check course bank
		for (let i=0; i<this.course_bank.length; i++) {
			if (course == this.course_bank[i]) {
				this.course_bank.splice(i, 1);
				return;
			}
		}
		//check transfer
		for (let i=0; i<this.transfer_bank.length; i++) {
			if (course == this.transfer_bank[i]) {
				this.transfer_bank.splice(i, 1);
				return;
			}
		}
		// Not found above - must be in semester grid
		for (let semester of this.semesters) {
			semester.remove_course(course);
		}
	}
	
	//id is string
	course_id_to_object(id) {
		return COURSES.find(course => course.course_code == id);
	}

	fill_course_bank() {
		this.course_bank = this.major.req_class.map(req_class => this.course_id_to_object(req_class));
	}

	add_semester(season, year) {
		let new_order = year*3 + season;
		for (let semester of this.semesters) {
			let old_order = semester.semester_year*3 + semester.semester_season;
			if (old_order+1 == new_order) {
				this.semesters.splice(i+1, 0, new Semester(season, year, []));
				return; // Important for preventing infinite loops
			}
		}
		// Add semester at end if location is not in middle
		this.semesters.splice(this.semesters.length, 0, new Semester(season, year, []));
	}

	remove_semester(season, year) {
		// Find the requested semester object
		let i = this.semesters.findIndex(semester => season == semester.semester_season && year == semester.semester_year);

		// Prevent removing semesters containing courses
		if (this.semesters[i].semester_courses.find(course => course != undefined)) return;
		this.semesters.splice(i, 1);
	}

	get_longest() {
		// Traverse through semesters, updating longest with the length of the longest semester found so far
		return this.semesters.reduce((longest, semester) => Math.max(semester.semester_courses.length, longest), MIN_COLS);
	}

	/*
		check each course
		find course coordinate
		look for course pre/co req
		find req courses coordinate
		create arrow
		This function is also pulling double-duty checking validations
	*/
	generate_arrows() {
		var arr_arrows = [];
		
		this.semesters.forEach((semester, y) => {
			semester.semester_courses.forEach((course, x) => {
				for (let prereq of course.prereq) {
					let coord_req = this.find_course(prereq);
					if (coord_req != undefined) {
						arr_arrows.push(new Arrow(coord_req[1], coord_req[0], x, y, false));
						if (coord_req[0] >= y)
							this.add_error("INVALID COURSE: " + prereq + " is a prerequisite of " + course.course_code + "\n");
					}
				}
				for (let coreq of course.coreq) {
					let coord_req = this.find_course(coreq);
					if (coord_req != undefined) {
						arr_arrows.push(new Arrow(coord_req[1], coord_req[0], x, y, true));
						if (coord_req[0] > y)
							this.add_error("INVALID COURSE: " + coreq + " is a corequisite of " + course.course_code + "\n");
					}
				}
			});
		});
		
		// Check for excessive hours
		for (let plan of this.semesters) {
			if (plan.get_credit_hour() > MAX_HOURS) {
				this.add_error("EXCESS HOURS:" + plan.season_name() + " " + plan.semester_year + ": You are taking more than " + MAX_HOURS +
					" credit hours. You will need to fill out a waiver.\n");
			}
		}
		
		return arr_arrows;
	}
	
	add_error(msg) {
		for (let id of ["notifications", "print-notifications"]) {
			let ul = document.getElementById(id);
			let li = document.createElement("li");
			li.appendChild(document.createTextNode(msg));
			ul.appendChild(li);
		}
	}
}
