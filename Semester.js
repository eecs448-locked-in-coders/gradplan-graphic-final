//Fall-Summer-Spring, year, and list of course codes placed in the semester
const MAX_HOURS = 19;
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
  
  get_credit_hour(){
    let sum = 0;
    for(let i = 0; i < this.semester_courses.length; i++){
      if(this.semester_courses[i] != undefined){
        sum = sum + this.semester_courses[i].credit_hour;
        if (sum > MAX_HOURS) {
        
          let ul = document.getElementById("notifications");
          let li = document.createElement("li");
          li.appendChild(document.createTextNode("EXCESS HOURS - "+this.season_name()+this.semester_year+": You are taking more than "+MAX_HOURS+
          " credit hours.You need to fill out a form. \n"));
          ul.appendChild(li);
          
          ul = document.getElementById("notifications2");
          li = document.createElement("li");
          li.appendChild(document.createTextNode("EXCESS HOURS - "+this.season_name()+this.semester_year+": You are taking more than "+MAX_HOURS+
          " credit hours.You need to fill out a form. \n"));
          ul.appendChild(li);
        }
      }
    }
    return sum;
  }

  season_name() {
	return (["Spring", "Summer", "Fall"])[this.semester_season];
  }
  
  add_course(course, index){
    this.semester_courses[index] = course;
  }
  remove_course(course){
    for(var i=0; i<this.semester_courses.length; i++){
      if(this.semester_courses[i] == course){
        this.semester_courses[i] = undefined;
      }
    }
  }
}
