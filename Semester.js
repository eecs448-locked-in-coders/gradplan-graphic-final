//Fall-Summer-Spring, year, and list of course codes placed in the semester
const MAX_HOURS = 19;
const SEASON_NAMES = ["Spring", "Summer", "Fall"];
class Semester {

	/*
		semester_season = int => 0,1,2
		semester_year = int
		semester_courses = [courses, courses, ...]
	*/
	constructor(semester_season, semester_year, semester_courses) {
		this.semester_season = semester_season;
		this.semester_year = semester_year;
		this.semester_courses = semester_courses;

	}

	/*
		@param: none
		@return: String from the string array Season names, 0=Spring, 1=Summer, 2=Fall
	*/
	season_name() {
		return SEASON_NAMES[this.semester_season];
	}

	/*
		@param: none
		@return: the sum of the credit hours in the semester
	*/
	get_credit_hour() {
		return this.semester_courses.reduce((sum, course) => sum + (course ? course.credit_hour : 0), 0);
	}

	/*
		@param: column index, course object,
		@post: semster_courses will add the course object at the column index
		@return: none
	*/
	add_course(col, course) {
		this.semester_courses[col] = course;
	}

	/*
		@param: course object
		@post: removes the course object from the course array
		@return: none
	*/
	remove_course(course) {
		let courseIndex = this.semester_courses.indexOf(course);
		if (courseIndex != undefined) {
			this.semester_courses[courseIndex] = undefined;
			// Remove any trailing undefineds left in array (important for Plan.getLongest)
			for (let i = this.semester_courses.length; i >= 0; i--) {
				if (this.semester_courses[i] != undefined) return;
				this.semester_courses.splice(i, 1);
			}
		}
	}
}
