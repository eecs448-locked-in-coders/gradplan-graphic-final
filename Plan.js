//Major, list of semester objects, list of transfer/exempt courses
const SPRING = 0, SUMMER = 1, FALL = 2;
class Plan {

  /*
    major = major object
    start_semester = int 0,1,2
    start_year = int, year
    semesters = [semester, semester, ...]
    course_bank = [course, course, ...]
  */
  constructor(major, start_season, start_year){
    this.major = major;
    this.semesters = [];
    this.course_bank = [];
    for(i=0; i<4; i++)
    {
      //Makes 8 semester of fall/spring, flips between fall and spring
      //ONLY WOKRS IF YOU START AT FALL/SPRING
      this.semesters.push(new Semester(start_season, start_year, []));
      if(start_season == FALL) start_year++;
      this.semesters.push(new Semester(2-start_season, start_year, []));
      if(start_season == SPRING) start_year++;
    }

  }
  remove_course(course){
    for(i=0; i<this.semesters.length(); i++){
      for(j=0; j<this.semesters[i].semester_courses.length(); j++){
        if(this.semesters[i].semester_courses[j] == course){
          this.semesters[i].semester_course[j] = undefined;
        }
      }
    }
    //check course bank
    for(i=0; i<this.course_bank.length(); i++){
      this.course_bank[i] = undefined;
    }
  }

}
