//List of required classes, list of electives, credit hour requirements
class Major {
  /*
    major_name = string
    req_class = [string]
  */
  constructor(major_name, req_class){
    this.major_name = major_name;
    this.req_class = req_class;
  }
}

const MAJORS = [
	new Major("Computer Science",
		["EECS 101", "EECS 140","EECS 168", "EECS 210", "EECS 268", "EECS 368", "EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581",
		"EECS 582", "EECS 645", "EECS 660", "EECS 662", "EECS 665", "EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290",
		"MATH 526", "PHSX 210", "PHSX 212", "PHSX 216", "PHSX 236", "Senior Elec 1", "Senior Elec 2", "Senior Elec 3",
		"Senior Elec 4", "Prof Elec", "GE 3N", "GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "Add A/H", "Add SS",
    "AE 4.1", "AE 4.2"])

];
