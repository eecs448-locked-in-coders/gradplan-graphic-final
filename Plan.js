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

	get_course(semester, col) {
		return this.semesters[semester].semester_courses[col];
	}

	find_course(course_code) {
		let coords;
		this.semesters.forEach((semester, y) => {
			semester.semester_courses.forEach((course, x) => {
				if (course != undefined && course_code == course.course_code) coords = [y, x];
			});
		});
		return coords;
	}

	add_course(semester, col, course) {
		this.semesters[semester].add_course(col, course);
	}

	remove_course(course) {
		//check course and transfer banks
		for (let bank of [this.course_bank, this.transfer_bank]) {
			for (let i = 0; i < bank.length; i++) {
				if (course == bank[i]) {
					bank.splice(i, 1);
					return;
				}
			}
		}
		// Not found above - must be in semester grid
		for (let semester of this.semesters) {
			semester.remove_course(course);
		}
	}

	course_code_to_object(course_code) {
		return COURSES.find(course => course.course_code == course_code);
	}

	fill_course_bank() {
		this.course_bank = this.major.req_class.map(req_class => this.course_code_to_object(req_class));
	}

	add_semester(season, year) {
		let new_order = year*3 + season;
		for (let i = 0; i < this.semesters.length; i++) {
			let old_order = this.semesters[i].semester_year*3 + this.semesters[i].semester_season;
			if (old_order+1 == new_order) {
				this.semesters.splice(i+1, 0, new Semester(season, year, []));
				return; // Important for preventing infinite loops
			}
		}
		// Add semester at end if location is not in middle
		this.semesters.splice(this.semesters.length, 0, new Semester(season, year, []));
	}

	remove_semester(season, year) {
		let x = null;
		// Find the requested semester object
		for(let i=0; i<this.semesters.length; i++){
			if((season == this.semesters[i].semester_season) && (year == this.semesters[i].semester_year)){
				x = i;
				for(let j=0; j<this.semesters[i].semester_courses.length; j++){
					if (this.semesters[i].semester_courses[j].course != undefined)){
						return;
					}
				}
			}
		}
		// Prevent removing semesters containing courses

		if(x === null){
			return;
		}
		this.semesters.splice(x, 1);
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
				if (course != undefined) {
					for (let reqs of [course.prereq, course.coreq]) {
						for (let req of reqs) {
							let coord_req = this.find_course(req);
							if (coord_req != undefined) {
								arr_arrows.push(new Arrow(coord_req[1], coord_req[0], x, y, reqs == course.coreq));
							}
						}
					}
				}
			});
		});

		return arr_arrows;
	}
}
