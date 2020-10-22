//Fall-Summer-Spring, year, and list of course codes placed in the semester
class Semester {

  /*
    semester_season = int => 0,1,2
    semester_year = int
    semester_courses = [courses, courses, ...]
  */
  constructor(semester_season, semester_year, semester_courses){
    this.semester_season = semester_season;
    this.semester_year = semester_year;
    this.semester_courses = semester_courses;
  }
  add_course(course, index){
    this.semester_courses[index] = course;
  }

}
