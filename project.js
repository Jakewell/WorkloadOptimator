$(function() {
    
    /* SOURCES
	- http://stackoverflow.com/questions/7774769/how-do-i-solve-the-classic-knapsack-algorithm-recursively
	- Multiple questions and answers on stackoverflow.com
	- Also some information on w3schools.com
	*/
    
    
    //Check if browser is firefox. This is needed later in backspace keypress fix
    var isFirefox = typeof InstallTrigger !== 'undefined';
    
	// Array including all courses
	var courseArray = [
		{
			name: "Projekti",
			credits: 20,
			hours: 200
		},
		
		{
			name: "Algoritmit",
			credits: 2,
			hours: 40
		},
		
		{
			name: "Videot",
			credits: 5,
			hours: 20
		},
		
		{
			name: "Keikka",
			credits: 1,
			hours: 10
		},
		
		{
			name: "Ohjelmointi",
			credits: 9,
			hours: 90
		},
		
		{
			name: "Lopputyö",
			credits: 17,
			hours: 100
		}
	];
	
	// When DOM has loaded, set the max hours input value to 200
	// List all the items in the courses array
    $("#maxWorkloadInput").val(200);
	listCourseItems();
	
	function listCourseItems() {
		$("#courseListTable").append(
			"<tr>" +
				"<th>Course name</th>" +
				"<th>Credits</th>" +
				"<th>Workload</th>" +
				"<th></th>" +
			"</tr>"
		);
		
		for (var i = 0; i < courseArray.length; i++) {
			$("#courseListTable").append(
				"<tr>" +
					"<td>" + courseArray[i].name + "</td>" +
					"<td>" + courseArray[i].credits + " cr</td>" +
					"<td>" + courseArray[i].hours + " h</td>" +
					"<td><button id='xButtonID" + i + "' class='btn btn-danger xButton'><i class='fa fa-times fa-lg' aria-hidden='true'></i></td>" +
				"</tr>"
			);
		}
	}
	
	// Add a course by pressing the + button
	$("#plusButton").on("click", addCourse);
    
    // Function for adding courses
	// Display the updated courses array
    function addCourse(){
        if ( !($("#courseNameInput").val() && $("#creditsInput").val() && $("#workloadInput").val()) ) {
			$("#warningField").empty();
			$("#warningField").append("<span class='redColor'>All fields are required!</span>")
			return;
		} else {
			var nameValue = $("#courseNameInput").val();
			var creditsValue = $("#creditsInput").val();
			var workValue = $("#workloadInput").val();
			
			nameValue = $.trim(nameValue);
			creditsValue = $.trim(creditsValue);
			workValue = $.trim(workValue);
            
            var creditsValueNumber = Number(creditsValue);
            var workValueNumber = Number(workValue);

			courseArray.push({
				name: nameValue,
				credits: creditsValueNumber,
				hours: workValueNumber
			});
			
			$("#courseNameInput").val("");
			$("#creditsInput").val("");
			$("#workloadInput").val("");
			
			$("#warningField").empty();
			$("#warningField").append("<span class='greenColor'>Course was added!</span>");
			
			$("#courseListTable").empty();
			listCourseItems();
            console.log(courseArray);
		}
        
    }
	
	// Remove a course by pressing the X button
	// Display the updated courses array
	$("#courseListTable").on("click", ".xButton", function() {
        var currentPos = $(this).attr("id");
        var currentButtonID = currentPos.slice(9);
        courseArray.splice(currentButtonID, 1);
		$("#warningField").empty();
		$("#warningField").append("<span class='greenColor'>Course was deleted!</span>")
		$("#courseListTable").empty();
		listCourseItems();
	});
	
	
	$("#calculateButton").on("click", calculateCourses);
    
    // Calculate the optimal courses
	// Knapsack function ->
	// Pass the returned optimal credits to findSums function ->
	// List the returned courses from the optimalSets array
    function calculateCourses() {
        $("#resultListContainer").empty();
		if ($("#maxWorkloadInput").val()) {
			$("#warningField").empty();
			var maxHours = $("#maxWorkloadInput").val();
			var maxHoursNumber = Number(maxHours);
			var creditsResult = knapSack(courseArray.length - 1, maxHoursNumber);
			console.log(creditsResult);
			
			var optimalCourses = findSums(courseArray, creditsResult);
			listResultItems(optimalCourses);
			$("html, body").animate({
				scrollTop: $(".resultListTable:first").offset().top
			}, 1000);
		} else {
			$("#warningField").empty();
			$("#warningField").append("<span class='redColor'>Maximum Workload is required!</span>");
		}
        
    }
	
	// Input validation for maximum workload
	$("#maxWorkloadInput").keypress(function(e) {
        
        var key = e.keyCode || e.charCode;
        
        if (key == 13) {
            calculateCourses();
            return;
        }
        
        if ( isFirefox && (key == 8 || key == 46 || (key >= 37 && key <= 40)) ) {return;}
        
		var regex = new RegExp("^[0-9]+$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regex.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	// Input validation for adding a course
	$("#courseNameInput").keypress(function(e) {
        
        var key = e.keyCode || e.charCode;
        
        if (key == 13) {
            addCourse();
            return;
        }
        
        if ( isFirefox && (key == 8 || key == 46 || (key >= 37 && key <= 40)) ) {return;}
        
		var regexName = new RegExp("^[a-zA-Z0-9åÅäÄöÖ ]+( [a-zA-Z0-9]+)*$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regexName.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	$("#creditsInput").keypress(function(e) {
        
        var key = e.keyCode || e.charCode;
        
        if (key == 13) {
            addCourse();
            return;
        }
        
        if ( isFirefox && (key == 8 || key == 46 || (key >= 37 && key <= 40)) ) {return;}
        
		var regexCredits = new RegExp("^[0-9]+$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regexCredits.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	$("#workloadInput").keypress(function(e) {
        
        var key = e.keyCode || e.charCode;
        
        if (key == 13) {
            addCourse();
            return;
        }
        
        if ( isFirefox && (key == 8 || key == 46 || (key >= 37 && key <= 40)) ) {return;}
        
		var regexHours = new RegExp("^[0-9]+$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regexHours.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	// Display the optimal results in a new table
	function listResultItems(optimal) {
        
        for(var i = 0; i < optimal.length; i++){
            var creditsTotal = 0;
            var hoursTotal = 0;

            var panelPrimary = $('<div class="panel panel-primary"><div class="panel-heading">Optimal Courses</div></div>');

            var resultListTable = $('<table class="resultListTable" class="table"></table>');

            resultListTable.append(
                "<tr>" +
                    "<th>Course name</th>" +
                    "<th>Credits</th>" +
                    "<th>Workload</th>" +
                    "<th></th>" +
                "</tr>");

            for (var j = 0; j < optimal[i].length; j++) {
                creditsTotal += optimal[i][j].credits;
                hoursTotal += optimal[i][j].hours;
                resultListTable.append(
                    "<tr>" +
                        "<td>" + optimal[i][j].name + "</td>" +
                        "<td>" + optimal[i][j].credits + " cr</td>" +
                        "<td>" + optimal[i][j].hours + " h</td>" +
                        "<td></td>" +
                    "</tr>"
                );
            }

            resultListTable.append(
                "<tr>" +
                    "<td><span class='bolded'>Total</span></td>" +
                    "<td><span class='bolded'>" + creditsTotal + " cr</span></td>" +
                    "<td><span class='bolded'>" + hoursTotal + " h</span></td>" +
                    "<td></td>" +
                "</tr>"
            );

            panelPrimary.append(resultListTable);
            
            $("#resultListContainer").append(panelPrimary);
        }
        
	}
	
	// Calculate the actual problem case by using course credits
    function knapSack(a, b) {
        if (a < 0) {
            return 0;
        }
        
        if (courseArray[a].hours > b) {
            return knapSack(a - 1, b);
        } else {
            return Math.max( knapSack(a - 1, b), knapSack(a - 1, b - courseArray[a].hours) + courseArray[a].credits );
        }
    }
    
	// This function is for finding the right set of courses which sum into the optimal number of credits,
    // so that the courses can be returned and listed for the user. 
    // Function works by finding all the possible set of courses which sum into the number of credits calculated 
    // by knapSack function, and then evaluating the correct set with lowest workload (and which does not 
    // exceed the maximum workload).
    // Result array is outputted to the console.
	function findSums(courseArray, targetSum) {
		var sumSets = [];
		var temp = [];
        var optimalSets = [];
		var courseSets = powerset(courseArray);
        var workLoad;
		for (var i = 0; i < courseSets.length; i++) {
			var courseSet = courseSets[i]; 
			if (sumCredits(courseSet) == targetSum) {
				sumSets.push(courseSet);
			}
		}
		
		for (var i = 0; i < sumSets.length; i++) {
			var sumSet = sumSets[i];
			
			if (sumHours(sumSet) <= $("#maxWorkloadInput").val()) {
				temp.push(sumSet);
			}
		}
        
        var lowestWork = $("#maxWorkloadInput").val();
        
        for(var i = 0; i < temp.length; i++) {
            workLoad = sumHours(temp[i]); 
             if(workLoad < lowestWork){
                 lowestWork = workLoad;
             }   
        }
        
        for(var i = 0; i < temp.length; i++) {
            workLoad = sumHours(temp[i]); 
             if(workLoad == lowestWork){
                 optimalSets.push(temp[i]);
             }   
        }
        
        console.log("All possible sum sets:");
		console.log(sumSets);
        console.log("Most optimal sum sets:");
		console.log(optimalSets);
		return optimalSets;
	}
    
    function powerset(courseArray) {
		var ps = [[]];
		for (var i = 0; i < courseArray.length; i++) {
			for (var j = 0, len = ps.length; j < len; j++) {
				ps.push(ps[j].concat(courseArray[i]));
			}
		}
		return ps;
	}

	function sumCredits(arr) {
		var total = 0;
		for (var i = 0; i < arr.length; i++) {
			total += arr[i].credits;
		}
		return total
	}
	
	function sumHours (arr) {
		var total = 0;
		for (var i = 0; i < arr.length; i++) {
			total += arr[i].hours;
		}
		return total
	}
    
});