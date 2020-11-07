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
		this.ule = false;
		this.fill_course_bank_w_req_classes();
		for (var i = 0; i < 4; i++) {
			//Makes 8 semester of fall/spring, flips between fall and spring
			//ONLY WOKRS IF YOU START AT FALL/SPRING
			this.semesters.push(new Semester(start_season, start_year, []));
			if (start_season == FALL) start_year++;
			this.semesters.push(new Semester(2-start_season, start_year, []));
			if (start_season == SPRING) start_year++;
		}
	}
	
	plan_to_string() {
		// Version exists to allows this format to be modified in future versions
		let plan = {
			"version": 1, 
			"timestamp": Date.now(),
			"major": this.major.major_name, 
			"course_bank": this.course_bank.map(course => course.course_code),
			"transfer_bank": this.transfer_bank.map(course => course.course_code),
			"semesters": this.semesters.map(semester => ({
				"semester_year": semester.semester_year,
				"semester_season": semester.semester_season,
				"semester_courses": semester.semester_courses.map(course => {
					if (course == undefined) return "";
					else if (course.is_custom) return [course.course_code, course.credit_hour];
					else return course.course_code;
				}),
			})),
		};
		console.log(plan);
		return JSON.stringify(plan);
	}
	
	// Return if the string is parsed successfully
	string_to_plan(plan) {
		try {
			plan = JSON.parse(plan);
			if (plan.version != 1) return false; // Unsupported version
			this.major = MAJORS.find(major => major.major_name = plan.major);
			this.course_bank = plan.course_bank.map(course_code => this.course_code_to_object(course_code));
			this.transfer_bank = plan.transfer_bank.map(course_code => this.course_code_to_object(course_code));
			this.semesters = plan.semesters.map(semester => new Semester(
				semester.semester_season,
				semester.semester_year,
				semester.semester_courses.map(course_code => {
					if (course_code == "") return undefined;
					else if (Array.isArray(course_code)) { // custom course - recreate it
						console.log(course_code);
						let course = new Course(course_code[0], "Custom course", [], [], [1,1,1], course_code[1], true);
						COURSES.push(course);
						return course;
					}
					else return this.course_code_to_object(course_code)
				}),
			));
			return true; // Successful parse
		} catch (e) {
			// An error occured, most likely due an incorrectly formatted string
			console.log(e);
			return false;
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

	fill_course_bank_w_req_classes() {
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