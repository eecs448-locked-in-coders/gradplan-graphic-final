//Has a course code, prerequisite, corequisites, course offering, credit hours
const COURSES = [
  new Course("EECS 101", [], ["Math 104"], 1), new Course("EECS 140", [], ["Math 104"], 4), new Course("EECS 168", [], ["Math 104"], 4),
  new Course("EECS 210", ["EECS 168", "Math 126"] [], 4), new Course("EECS 268", ["EECS 168"], [], 4), new Course("EECS 368", ["EECS 268"], [], 3),
  new Course("EECS 388", ["EECS 140", "EECS 168"], [], 4), new Course("EECS 448", ["EECS 268"], [], 4), new Course("EECS 510", ["EECS 210"], [], 3),
  new Course("EECS 560", ["EECS 210", "EECS 448"], [], 4), new Course("EECS 581", ["EECS 448"], ["EECS 510", "EECS 560"], 3),
  new Course("EECS 582", ["EECS 581"], [], 3), new Course("EECS 645", ["EECS 388"], [], 3), new Course("EECS 660", ["EECS 560", "MATH 526"], [], 3),
  new Course(), new Course(), new Course(), new Course(), new Course(),    ]
class Course {
  /*
    course_code = string
    prereq = [string]
    coreq = [string]
    course_semester = [bool,bool,bool] Semester
    credit_hour = int
  */
  constructor(course_code, prereq, coreq, course_semester, credit_hour){
    this.course_code = course_code;
    this.prereq = prereq;
    this.coreq = coreq;
    this.course_semester = course_semester;
    this.credit_hour = credit_hour;
  }



}
