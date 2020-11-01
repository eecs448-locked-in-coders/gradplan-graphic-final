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
	constructor(course_code, title, prereq, coreq, course_semester, credit_hour, is_custom = false) {
		this.course_code = course_code;
		this.title = title;
		this.prereq = prereq;
		this.coreq = coreq;
		this.course_semester = course_semester;
		this.credit_hour = credit_hour;
		this.is_custom = is_custom; // Used when saving plans to strings
	}
	
	to_html() {
		return '<div class="redips-drag" data-toggle="tooltip" title="' + this.title + '" data-course="' + this.course_code + '">' + this.course_code + "<br>(" + this.credit_hour + ")</div>";
	}
}
COURSES = [
	new Course("EECS 101", "New Student Seminar", [], ["MATH 104"], [0,0,1], 1),
	new Course("EECS 140", "Introd to Digital Logic Design", [], ["MATH 104"], [1,0,1], 4),
	new Course("EECS 168", "Programming I",  [], ["MATH 104"], [1,1,1], 4),
	new Course("EECS 210", "Discrete Structures", ["EECS 168", "MATH 126"], [], [1,0,1], 4),
	new Course("EECS 268", "Programming II", ["EECS 168"], [], [1,1,1], 4),
	new Course("EECS 368", "Programming Language Paradigms", ["EECS 268"], [], [1,0,1], 3),
	new Course("EECS 388", "Embedded Systems", ["EECS 140", "EECS 168"], [], [1,0,1], 4),
	new Course("EECS 448", "Software Engineering I", ["EECS 268"], [], [1,0,1], 4),
	new Course("EECS 510", "Introdn to Theory of Computing", ["EECS 210"], [], [1,0,1], 3),
	new Course("EECS 560", "Data Structures", ["EECS 210", "EECS 448"], [], [1,0,1], 4),
	new Course("EECS 581", "Computer Science Design I", ["EECS 448"], ["EECS 510", "EECS 560"], [1,0,1], 3),
	new Course("EECS 582", "Computer Science Design II", ["EECS 581"], [], [1,0,1], 3),
	new Course("EECS 645", "Computer Architecture", ["EECS 388"], [], [1,0,1], 3),
	new Course("EECS 660", "Fndmntls of Computer Algorthms", ["EECS 560", "MATH 526"], [], [1,0,1], 3),
	new Course("EECS 662", "Programming Languages", ["EECS 368", "EECS 560"], [], [1,0,1], 3),
	new Course("EECS 665", "Compiler Construction", ["EECS 368", "EECS 448", "EECS 510"], [], [1,0,1], 4),
	new Course("EECS 678", "Introdctn to Operating Systems", ["EECS 388", "EECS 448"], [], [1,0,1], 4),
	new Course("Sen Elec 1", "Most 400+ EECS courses", [], [], [1,0,1], 3),
	new Course("Sen Elec 2", "Most 400+ EECS courses", [], [], [1,0,1], 3),
	new Course("Sen Elec 3", "Most 400+ EECS courses", [], [], [1,0,1], 3),
	new Course("Sen Elec 4", "Most 400+ EECS courses", [], [], [1,0,1], 3),
	new Course("MATH 125", "Calculus I",  [], [], [1,1,1], 4),
	new Course("MATH 126", "Calculus II", ["MATH 125"], [], [1,1,1], 4),
	new Course("MATH 127", "Calculus III", ["MATH 126"], [], [1,1,1], 4),
	new Course("MATH 290", "Elementary Linear Algebra", ["MATH 126"], [], [1,1,1], 2),
	new Course("MATH 526", "Appld Mathematicl Statistics I", ["MATH 127"], [], [1,1,1], 3),
	new Course("PHSX 210", "Generl Physics I for Engineers", ["MATH 125"], ["MATH 126"], [1,0,1], 3),
	new Course("PHSX 216", "General Physics I Laboratory", [], ["PHSX 210"], [1,1,1], 1),
	new Course("PHSX 212", "General Physics II", ["PHSX 210", "MATH 126"],[], [1,1,1], 3),
	new Course("PHSX 236", "General Physics II Laboratory", [], ["PHSX 212"], [1,1,1], 1),
	new Course("GE 3N", "Natural Science (typically CHEM 150 Chemistry for Engineers which is 5 credit hours)", [], [], [1,1,1], 3),
	new Course("Prof Elec", "Professional Elective", [], [], [1,1,1], 3),
	new Course("GE 2.1(1)", "Written Communication I (typically ENGL 101 Composition or exempt from ACT score)", [], [], [1,1,1], 3),
	new Course("GE 2.1(2)", "Written Communication II (typically ENGL 102 Critical Reading and Writing)", [], [], [1,1,1], 3),
	new Course("GE 2.2", "Oral Communication (typically COMS 130 Speaker-Audience Communication)", [], [], [1,1,1], 3),
	new Course("GE 3H", "Arts and Humanities", [], [], [1,1,1], 3),
	new Course("GE 3S", "Social Science", [], [], [1,1,1], 3),
	new Course("Add A/H", "Additional GE 3H course", [], [], [1,1,1], 3),
	new Course("Add SS", "Additional GE 3S course", [], [], [1,1,1], 3),
	new Course("AE 4.1", "United States cultural diversity", [], [], [1,1,1], 3),
	new Course("AE 4.2", "Global cultural diversity", [], [], [1,1,1], 3),
];
