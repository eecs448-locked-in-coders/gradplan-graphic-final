//List of required classes, list of electives, credit hour requirements
class Major {
	/*
		major_name = string
		req_class = [string]
	*/
	constructor(major_name, req_class) {
		this.major_name = major_name;
		this.req_class = req_class;
	}
}

const MAJORS = [
	new Major("Computer Science",[
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 645", "EECS 660", "EECS 662", "EECS 665", "EECS 678", "MATH 125",
		"MATH 126", "MATH 127", "MATH 290", "MATH 526", "PHSX 210", "PHSX 212",
		"PHSX 216", "PHSX 236", "Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"Sen Elec 4", "Prof Elec 1", "GE 3N", "GE 2.1(1)", "GE 2.1(2)",
		"GE 2.2", "GE 3H", "GE 3S", "Add A/H", "Add SS", "AE 4.1", "AE 4.2"
		]
	),
	new Major("Computer Engineering",[
		"EECS 101", "EECS 140", "EECS 168", "EECS 202", "EECS 210", "EECS 212",
		"EECS 221", "EECS 268", "EECS 312", "EECS 360", "EECS 368", "EECS 388",
		"EECS 443", "EECS 448", "EECS 541", "EECS 542", "EECS 563", "EECS 645",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 220", "MATH 290",
		"MATH 526", "PHSX 210", "PHSX 216", "PHSX 313", "PHSX 316", "Sen Elec 1",
		"Sen Elec 2", "Sen Elec 3", "Prof Elec 1", "GE 2.1(1)", "GE 2.1(2)",
		"GE 2.2", "GE 3H", "GE 3S", "ECON 142/144", "AE 4.1", "AE 4.2"
		]
	),
	new Major("Electrical Engineering", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 202", "EECS 212", "EECS 221",
		"EECS 312", "EECS 360", "EECS 388", "EECS 412", "EECS 420", "EECS 443",
		"EECS 444", "EECS 470", "EECS 501", "EECS 502", "EECS 562", "MATH 125",
		"MATH 126", "MATH 127", "MATH 220", "MATH 290", "MATH 526", "CHEM 130/150",
		"PHSX 210", "PHSX 216", "PHSX 313", "PHSX 316", "AE 4.1", "AE 4.2",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "ECON 142/144", "GE 3H", "Prof Elec 1",
		"Prof Elec 2", "Sen Elec 1", "Sen Elec 2", "Sen Elec 3"
		]
	),
	new Major("Interdisciplinary Computing (Astronomy)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"MATH 220", "ASTR 391", "ASTR 503", "ASTR 591", "ASTR 592", "ASTR 596",
		"PHSX 210", "PHSX 212", "PHSX 216", "PHSX 236", "PHSX 313", "PHSX 316",
		"Astr Elec 1", "Astr Elec 2"
		]
	),
	new Major("Interdisciplinary Computing (Biology)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"PHIL 375/320/160", "BIOL 150", "BIOL 152", "BIOL 350", "BIOL 412",
		"CHEM 130", "CHEM 135", "Biol Elec 1", "Biol Elec 2"
		]
	),
	new Major("Interdisciplinary Computing (Chemistry)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"MATH 220", "CHEM 130", "CHEM 135", "CHEM 330", "CHEM 530", "CHEM 537",
		"CHEM 535", "CHEM 698", "PHSX 210", "PHSX 212", "PHSX 216", "PHSX 236"
		]
	),
	new Major("Interdisciplinary Computing (Geography)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"Geog Basics 1", "Geog Basics 2", "GEOG 311", "GEOG 358", "GEOG 526",
		"GEOG 558", "PHSX 210", "PHYSX 216", "Geog Elec 1", "Geog Elec 2"
		]
	),
	new Major("Interdisciplinary Computing (Journalism: News/Information)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"JOUR 101", "JOUR 300", "JOUR 302", "JOUR 304", "JOUR 618", "Add A/H/SS", "AE 5.1",
		"JOUR 415", "JOUR 419", "JOUR Elec 1", "JOUR Elec 2"
		]
	),
	new Major("Interdisciplinary Computing (Journalism: Strategic Communication)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"JOUR 101", "JOUR 300", "JOUR 302", "JOUR 304", "JOUR 618", "Add A/H/SS", "AE 5.1",
		"JOUR 320", "JOUR Elec 1", "JOUR Elec 2", "JOUR Elec 3"
		]
	),
	new Major("Interdisciplinary Computing (Physics)", [
		"EECS 101", "EECS 140", "EECS 168", "EECS 210", "EECS 268", "EECS 368",
		"EECS 388", "EECS 448", "EECS 510", "EECS 560", "EECS 581", "EECS 582",
		"EECS 678", "MATH 125", "MATH 126", "MATH 127", "MATH 290", "MATH 526",
		"GE 2.1(1)", "GE 2.1(2)", "GE 2.2", "GE 3H", "GE 3S", "AE 4.1", "AE 4.2",
		"Sen Elec 1", "Sen Elec 2", "Sen Elec 3",
		"MATH 220", "PHSX 210", "PHSX 212", "PHSX 216", "PHSX 236", "PHSX 313",
		"PHSX 316", "PHSX 503", "PHSX 511", "PHSX 521", "PHSX 531",
		"Phsx Elec 1", "Phsx Elec 2"
		]
	)
];
