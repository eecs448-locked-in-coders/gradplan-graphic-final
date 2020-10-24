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
    for(var i=0; i<4; i++)
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
    for(var i=0; i<this.semesters.length; i++){
      this.semesters[i].remove_course(course);
    }
    //check course bank
    for(var i=0; i<this.course_bank.length; i++){
      this.course_bank[i] = undefined;
    }
  }
  //id is string
  course_id_to_object(id){
    for(var i=0; i<COURSES.length; i++){
      if(id == COURSES[i].course_code){
        return(COURSES[i]);
      }
    }
  }

  fill_course_bank(){
    for(var i=0; i<this.major.req_class.length; i++){
      this.course_bank.push(course_id_to_object(this.major.req_class[i]));
    }
  }

  add_semester(season, year){
    let duplicate = false;
    for(var i=0; i<this.semesters.length; i++){
      duplicate = (season == this.semesters[i].semester_season && year == this.semester[i].semeseter_year);
      if(season > this.semesters[i].semester_season && year > this.semesters[i].semester_year && !duplicate){
        this.semesters.splice(i, 0, new Semester(season, year, []));
      }
    }
  }

  remove_semester(season, year){
    for(var i=0; i<this.semesters.length; i++){
      if(season == this.semesters[i].semester_season && year == this.semesters[i].semseter_year){
        for(var j=0; j<this.semesters[i].semester_courses.length; j++){
          if(this.semesters[i].semster_courses[j] != undefined){
            return;
          }
        }
        this.semester.splice(i, 1);
      }
    }
  }

  get_longest(){
	var longest = 0;
    for(var i=0; i<this.semesters.length; i++){
      if(this.semesters[i].semester_courses.length > longest){
        longest = this.semesters[i].semester_courses.length;
      }
    }
    return longest;
  }
}
