"use strict";

// resume section data

var bio = {
    "name": "Daniel Kaulen",
    "role": "Software Engineer",
    "contacts": {
        "mobile": "+49-151-123456789",
        "email": "daniel.kaulen@gmx.de",
        "github": "daka1510",
        "location": "Aachen, Germany"
    },
    "welcomeMessage": "\"We can only see a short distance ahead, but we can see plenty there that needs to be done\" (Alan Turing)",
    "skills": ["Java", "Node.JS", "HTML", "JavaScript", "CSS"],
    "biopic": "img/me.png"
};

var education = {
    "schools": [{
        "name": "RWTH Aachen University",
        "location": "Aachen, Germany",
        "degree": "Master of Science",
        "majors": ["Computer Science"],
        "dates": "2012 - 2015",
        "url": "http://www.rwth-aachen.de"
    }, {
        "name": "RWTH Aachen University",
        "location": "Aachen, Germany",
        "degree": "Bachelor of Science",
        "majors": ["Communication Science", "Computer Science"],
        "dates": "2009 - 2012",
        "url": "http://www.rwth-aachen.de"
    }],
    "onlineCourses": [{
        "title": "Front-End Web Developer Nanodegree",
        "school": "Udacity",
        "dates": "2015 - 2016",
        "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001"
    }]
};

var work = {
    "jobs": [{
        "employer": "IBM Research & Development GmbH",
        "title": "Software Engineer",
        "location": "Böblingen, Germany",
        "dates": "in progress",
        "description": "Java back-end developer for a cloud-based CMS solution.",
        "url": "https://www.ibm.com"
    }, {
        "employer": "INFORM GMBH",
        "title": "Student Worker",
        "location": "Aachen, Germany",
        "dates": "2013 - 2014",
        "description": "Software development.",
        "url": "https://www.inform-software.com"
    }, {
        "employer": "INFORM GMBH",
        "title": "Student Worker (Test Automation)",
        "location": "Aachen, Germany",
        "dates": "2010 - 2012",
        "description": "Test automation.",
        "url": "https://www.inform-software.com"
    }]
};

var projects = {
    "projects": [{
        "title": "Master Thesis, Design Lab at UC San Diego",
        "dates": "2015",
        "description": "Trauma teams work under extreme time pressure while stabilizing critically injuredpatients and addressing life-threatening injuries. Over the years, several studieshave analyzed different opportunities for technological innovations in this field. Itwas found that there is no optimal position for team-based displays and that largescreens do not adequately address role-based information needs.<br>To compensate for this disadvantage, we analyzed the applicability of head-up displaysduring trauma resuscitations in an exploratory study. A generic prototypingframework for Google Glass was developed to support these efforts. As part of ouruser-centered design process, we conducted interviews with trauma doctors andobserved training sessions that incorporated a human patient simulator. Finally, aworking prototype offering HUD-based support for trauma teams was evaluatedduring two simulated resuscitations.<br>A qualitative analysis showed that the most important application area is the visualizationof vital signs in the field of view (i.e. the doctors do not need to lookaway from the patient to check the vital signs on team-based monitors). Additionally,contextual checklists on individual head-up displays can lead to improvedprotocol adherence and team communication. Our results reduce the design spacefor future projects and serve as basis for upcoming quantitative evaluations of theefficacy of using head-up displays during trauma resuscitation.",
        "images": ["img/master-01.jpg", "img/master-02.jpg", "img/master-03.jpg"],
        "location": "San Diego, CA, USA",
        "url": "http://hci.rwth-aachen.de/kaulen"
    }, {
        "title": "Internship, NARA Institute of Science and Technology",
        "dates": "2013",
        "description": "The development of a widely applicable automatic motion coaching system requires one to address a lot of issues including motion capturing, motion analysis and comparison, error detection as well as error feedback. In order to cope with this complexity, most existing approaches focus on a specific motion sequence or exercise. As a first step towards the development of a more generic system, this paper systematically analyzes different error and feedback types. A prototype of a feedback system that addresses multiple modalities is presented. The system allows to evaluate the applicability of the proposed feedback techniques for arbitrary types of motions in a next step.",
        "images": ["img/naist-01.jpg", "img/naist-02.jpg"],
        "location": "Nara, Japan",
        "url": "http://ambient.naist.jp"
    }, {
        "title": "Bachelor Thesis, RWTH Aachen",
        "dates": "2012",
        "description": "This thesis analyzes the requirements of users of different generations with regard to future e-banking systems. An empirical study was conducted to verify six previously formulated hypotheses. The results show that the acceptance of such systems highly depends on factors such as age, gender and general technical affinity. It turned out that most of the older people are not yet willing to use such systems at all – independent of specific system characteristics. Additionally, it is more likely that men will use smart banking systems than women and that technical affinity has a positive influence on the general usage intention.",
        "images": ["img/bachelor-01.jpg", "img/bachelor-02.jpg"],
        "location": "Aachen, Germany",
        "url": "http://www.rwth-aachen.de"
    }]
};

// display functions

bio.display = function() {
    // add name and role
    $("#header").prepend(HTMLheaderRole.replace("%data%", this.role));
    $("#header").prepend(HTMLheaderName.replace("%data%", this.name));

    // show available contact information
    for (var key in this.contacts) {
        if (this.contacts.hasOwnProperty(key)) {
            var contactMarkup = HTMLcontactGeneric.replace("%contact%", key).replace("%data%", this.contacts[key]);
            $("#topContacts").append(contactMarkup);
            $("#footerContacts").append(contactMarkup);
        }
    }

    // add picture along with a welcome message
    $("#header").append(HTMLbioPic.replace("%data%", this.biopic).replace("%name%", this.name));
    $("#header").append(HTMLwelcomeMsg.replace("%data%", this.welcomeMessage));

    // add skills
    if (this.skills.length > 0) {
        $("#header").append(HTMLskillsStart);
        this.skills.forEach(function(value) {
            $("#skills").append(HTMLskills.replace("%data%", value));
        });
    }
};

education.display = function() {
    // display schools
    this.schools.forEach(function(school) {
        $("#education").append(HTMLschoolStart);
        var formattedName = HTMLschoolName.replace("%data%", school.name).replace("%url%", school.url);
        var formattedDegree = HTMLschoolDegree.replace("%data%", school.degree);
        var formattedDates = HTMLschoolDates.replace("%data%", school.dates);
        var formattedLocation = HTMLschoolLocation.replace("%data%", school.location);
        var formattedMajor = HTMLschoolMajor.replace("%data%", school.majors);

        $(".education-entry:last").append(formattedName
            .concat(formattedDegree)
            .concat(formattedDates)
            .concat(formattedLocation)
            .concat(formattedMajor));
    });

    // display online courses
    if (this.onlineCourses.length > 0) {
        $("#education").append(HTMLonlineClasses);
        this.onlineCourses.forEach(function(course) {
            $("#education").append(HTMLschoolStart);
            var formattedTitle = HTMLonlineTitle.replace("%data%", course.title).replace("%url%", course.url);
            var formattedSchool = HTMLonlineSchool.replace("%data%", course.school);
            var formattedDates = HTMLonlineDates.replace("%data%", course.dates);
            $(".education-entry:last").append(formattedTitle
                .concat(formattedSchool)
                .concat(formattedDates)).append("<br>");
        });
    }
};

work.display = function() {
    this.jobs.forEach(function(job) {
        $("#workExperience").append(HTMLworkStart);
        var formattedEmployer = HTMLworkEmployer.replace("%data%", job.employer).replace("%url%", job.url);
        var formattedJobTitle = HTMLworkTitle.replace("%data%", job.title);
        var formattedJobDates = HTMLworkDates.replace("%data%", job.dates);
        var formattedJobDescription = HTMLworkDescription.replace("%data%", job.description);
        var formattedJobLocation = HTMLworkLocation.replace("%data%", job.location);
        $(".work-entry:last").append(formattedEmployer
            .concat(formattedJobTitle)
            .concat(formattedJobDates)
            .concat(formattedJobDescription)
            .concat(formattedJobLocation));
    });
};

projects.display = function() {
    this.projects.forEach(function(project) {
        // compute markup
        $("#projects").append(HTMLprojectStart);
        var projectData = HTMLprojectTitle.replace("%data%", project.title).replace("%url%", project.url)
            .concat(HTMLprojectDates.replace("%data%", project.dates))
            .concat(HTMLprojectDescription.replace("%data%", project.description));

        project.images.forEach(function(imageUrl) {
            projectData = projectData + HTMLprojectImage.replace("%data%", imageUrl).replace("%alt%", "Image of " + project.title);
        });
        // add to DOM
        $(".project-entry:last").append(projectData);
    });
};

// trigger function calls
projects.display();
education.display();
bio.display();
work.display();

// add map
$("#mapDiv").append(googleMap);