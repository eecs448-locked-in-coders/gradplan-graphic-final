//Has a course code, prerequisite, corequisites, course offering, credit hours
class Course {
  /*
    course_code = string
    prereq = [string]
    coreq = [string]
    course_offer = [bool,bool,bool]
    credit_hour = int
  */
  constructor(course_code, prereq, coreq, course_offer, credit_hour){
    this.course_code = course_code;
    this.prereq = prereq;
    this.coreq = coreq;
    this.course_offer = course_offer;
    this.credit_hour = credit_hour;
  }

}
