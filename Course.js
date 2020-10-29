//Has a course code, prerequisite, corequisites, course offering, credit hours
class Course {
	/*
		course_code = string
		prereq = [string]
		coreq = [string]
		course_semester = [Spring, Summer, Fall] => [bool,bool,bool] Semester
										Remember that winter doesn't exist, its just extended spring
		credit_hour = int
	*/
	constructor(course_code, prereq, coreq, course_semester, credit_hour) {
		this.course_code = course_code;
		this.prereq = prereq;
		this.coreq = coreq;
		this.course_semester = course_semester;
		this.credit_hour = credit_hour;
	}
	
	to_html() {
		return '<div class="redips-drag" data-course="' + this.course_code + '">' + this.course_code + "<br>(" + this.credit_hour + ")</div>";
	}
}
const COURSES = [
	new Course("EECS 101", [], ["MATH 104"], [0,0,1], 1),
	new Course("EECS 140", [], ["MATH 104"], [1,0,1], 4),
	new Course("EECS 168", [], ["MATH 104"], [1,1,1], 4),
	new Course("EECS 210", ["EECS 168", "MATH 126"], [], [1,0,1], 4),
	new Course("EECS 268", ["EECS 168"], [], [1,1,1], 4),
	new Course("EECS 368", ["EECS 268"], [], [1,0,1], 3),
	new Course("EECS 388", ["EECS 140", "EECS 168"], [], [1,0,1], 4),
	new Course("EECS 448", ["EECS 268"], [], [1,0,1], 4),
	new Course("EECS 510", ["EECS 210"], [], [1,0,1], 3),
	new Course("EECS 560", ["EECS 210", "EECS 448"], [], [1,0,1], 4),
	new Course("EECS 581", ["EECS 448"], ["EECS 510", "EECS 560"], [1,0,1], 3),
	new Course("EECS 582", ["EECS 581"], [], [1,0,1], 3),
	new Course("EECS 645", ["EECS 388"], [], [1,0,1], 3),
	new Course("EECS 660", ["EECS 560", "MATH 526"], [], [1,0,1], 3),
	new Course("EECS 662", ["EECS 368", "EECS 560"], [], [1,0,1], 3),
	new Course("EECS 665", ["EECS 368", "EECS 448", "EECS 510"], [], [1,0,1], 4),
	new Course("EECS 678", ["EECS 388", "EECS 448"], [], [1,0,1], 4),
	new Course("Sen Elec 1", [], [], [1,0,1], 3),
	new Course("Sen Elec 2", [], [], [1,0,1], 3),
	new Course("Sen Elec 3", [], [], [1,0,1], 3),
	new Course("Sen Elec 4", [], [], [1,0,1], 3),
	new Course("MATH 125", [], [], [1,1,1], 4),
	new Course("MATH 126", ["MATH 125"], [], [1,1,1], 4),
	new Course("MATH 127", ["MATH 126"], [], [1,1,1], 4),
	new Course("MATH 290", ["MATH 126"], [], [1,1,1], 2),
	new Course("MATH 526", ["MATH 127"], [], [1,1,1], 3),
	new Course("PHSX 210", ["MATH 125"], ["MATH 126"], [1,0,1], 3),
	new Course("PHSX 216", [], ["PHSX 210"], [1,1,1], 1),
	new Course("PHSX 212", ["PHSX 210", "MATH 126"],[], [1,1,1], 3),
	new Course("PHSX 236", [], ["PHSX 212"], [1,1,1], 1),
	new Course("GE 3N", [], [], [1,1,1], 3),
	new Course("Prof Elec", [], [], [1,1,1], 3),
	new Course("GE 2.1(1)", [], [], [1,1,1], 3),
	new Course("GE 2.1(2)", [], [], [1,1,1], 3),
	new Course("GE 2.2", [], [], [1,1,1], 3),
	new Course("GE 3H", [], [], [1,1,1], 3),
	new Course("GE 3S", [], [], [1,1,1], 3),
	new Course("Add A/H", [], [], [1,1,1], 3),
	new Course("Add SS", [], [], [1,1,1], 3),
	new Course("AE 4.1", [], [], [1,1,1], 3),
	new Course("AE 4.2", [], [], [1,1,1], 3),
];
