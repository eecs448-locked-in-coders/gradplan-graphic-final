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

  find_course(course_string){
    for(var i=0; i<this.semesters.length; i++){
      if(this.semesters[i].semester_course != undefined){
        for(var j=0; j<this.semseters[i].semsester_courses.length; j++){
          if(course_string == this.semesters[i].semester_courses[j].course_code){
            return[i,j];
          }
        }
      }
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
      duplicate = (season == this.semesters[i].semester_season && year == this.semester[i].semester_year);
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

  generate_arrows(){
    var arr_arrows = [];
    //rename to cord_course
    var cord_course = [];
    var cord_req = [];
    /*
      check each course
      find course coordinate
      look for course pre/co req
      find req courses coordinate
      create arrow
    */
    for(var i=0; i<this.semesters.length; i++){
      for(var j=0; j<this.semesters[i].semester_courses.length; j++){
        cord_course[0] = i;//x and y coordinates
        cord_course[1] = j;
        if(this.semesters[i].semester_courses[j] != undefined){
          for(var x=0; x<this.semesters[i].semester_courses[j].prereq.length; x++){
            cord_req = this.find_course(this.semesters[i].semester_courses[j].prereq[x]);
            if(cord_req != undefined){
              arr_arrows.push(new Arrow(cord_req[0], cord_req[1], cord_course[0], cord_course[1], false));
            }
          }
          for(var y=0; y<this.semesters[i].semester_courses[j].coreq.length; y++){
            cord_req = this.find_course(this.semesters[i].semester_courses[j].coreq[y]);
            if(cord_req){
              arr_arrows.push(new Arrow(cord_req[0], cord_req[1], cord_course[0], cord_course[1], true));
            }
          }
        }
      }
    }
    return (arr_arrows);
  }
}
