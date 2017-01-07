// TODO: refactor (add work.display, projects.display, ...)
// TODO: get map working
// TODO: make it my own, e.g. https://d3js.org/, https://developers.google.com/maps/documentation/javascript/tutorial
var work = {
    "jobs" : [{
        "employer" : "IBM Research & Development GmbH",
        "title" : "Software Engineer",
        "location" : "Böblingen",
        "date" : "2015 - 2016",
        "description" : "bla blub"
    },{
        "employer" : "INFORM GMBH",
        "title" : "Student",
        "location" : "Aachen",
        "date" : "2010 - 2014",
        "description" : "blub bla"
    }]
};

var projects = {
    "projects" : [{
        "title" : "Bachelor Thesis",
        "dates" : "2012",
        "description" : "An awesome text about my thesis",
        "images" : ["img/197x148.gif","img/197x148.gif","img/197x148.gif"],
        "location" : "Aachen"
    },{
        "title" : "Master Thesis",
        "dates" : "2015",
        "description" : "An awesome text about my thesis",
        "images" : ["img/197x148.gif", "img/197x148.gif"],
        "location" : "Aachen",
    }, {
        "title" : "Internship",
        "dates" : "2015",
        "description" : "An awesome text about my thesis",
        "images" : ["img/197x148.gif", "img/197x148.gif"],
        "location" : "Nara, Japan"
    }]
};


var bio = {
    "name" : "Daniel Kaulen",
    "role" : "Software Engineer",
    "contacts" : {
        "email" : "daniel.kaulen@gmx.de",
        "github" : "daka1510",
        "location" : "Aachen, Germany",
    },
    "welcomeMessage" : "lorem ipsum",
    "skills": ["Java", "HTML", "JavaScript", "CSS"],
    "bioPic" : "img/me.png"
};

var education = {
    "schools" : [{
        "name" : "n",
        "location" : "San Diego",
        "degree dates" : "3",
        "url" : "",
        "majors" : ["a", "b"]
    }],
    "onlineCourses" : [{
        "title" : "1",
        "school" : "3",
        "dates" : "4",
        "url" : "4"
    }]
}

 var formattedName = HTMLheaderName.replace("%data%", bio.name);
 var formattedRole = HTMLheaderRole.replace("%data%", bio.role);
 var picMarkup = HTMLbioPic.replace("%data%", bio.bioPic);
 var welcomeMessage = HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage);
 $("#header").prepend(formattedRole);
 $("#header").prepend(formattedName);

bio.display = function() {
    for (var key in bio.contacts) {
      if (bio.contacts.hasOwnProperty(key)) {
        $("#topContacts").append(HTMLcontactGeneric.replace("%contact%", key).replace("%data%", bio.contacts[key]))
      }
    }
}
bio.display();


 $("#header").append(picMarkup);
 $("#header").append(welcomeMessage);

 if(bio.skills.length > 0){
    $("#header").append(HTMLskillsStart);
    for (idx in bio.skills) {
        var formattedSkill = HTMLskills.replace("%data%", bio.skills[idx]);
        $("#skills").append(formattedSkill);
    }
 }

 function locationizer(work_obj){
    var result = [];
    for(idx in work_obj.jobs){
        result.push(work_obj.jobs[idx].location)
    }
    return result;
 }

 function displayWork(){
     if(work.jobs.length > 0) {
        for (idx in work.jobs) {
            $("#workExperience").append(HTMLworkStart);
            var formattedEmployer = HTMLworkEmployer.replace("%data%", work.jobs[idx].employer);
            var formattedJobTitle = HTMLworkTitle.replace("%data%", work.jobs[idx].title);
            var formattedJobDates = HTMLworkDates.replace("%data%", work.jobs[idx].date);
            var formattedJobDescription = HTMLworkDescription.replace("%data%", work.jobs[idx].description);

            $(".work-entry:last").append(formattedEmployer.concat(formattedJobTitle).concat(formattedJobDates).concat(formattedJobDescription));
        }
     }
 };
 displayWork();

$(document).click(function(loc) {
  logClicks(loc.pageX, loc.pageY)
});

function inName(name) {
    // split into first and last name
    console.log(name);
    var fragments = name.split(" ");
    var firstName = fragments[0];
    var lastName = fragments[1];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1) + " " + lastName.toUpperCase();
}

$("#main").append(internationalizeButton);

projects.display = function() {
    for(idx in projects.projects) {
        $("#projects").append(HTMLprojectStart);
        var projectData = "";
        projectData = HTMLprojectTitle.replace("%data%", projects.projects[idx].title)
                        + HTMLprojectDates.replace("%data%", projects.projects[idx].dates)
                        + HTMLprojectDescription.replace("%data%", projects.projects[idx].description);
        for(imageId in projects.projects[idx].images){
            projectData = projectData + HTMLprojectImage.replace("%data%", projects.projects[idx].images[imageId]);
        }
        $(".project-entry:last").append(projectData);
    }
}

projects.display();

$("#mapDiv").append(googleMap);