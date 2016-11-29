$(function() {
    
    /* SOURCES
	- http://stackoverflow.com/questions/7774769/how-do-i-solve-the-classic-knapsack-algorithm-recursively
	- Multiple questions and answers on stackoverflow.com
	- Also some information on w3schools.com
	*/
    
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
	// Display the updated courses array
	$("#plusButton").on("click", function() {
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
	});
	
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
	
	// Calculate the optimal courses
	// Knapsack function ->
	// Pass the returned optimal credits to findSums function ->
	// List the returned courses from the optimalSets array
	$("#calculateButton").on("click", function() {
		$("#resultListTable").empty();
		if ($("#maxWorkloadInput").val()) {
			$("#warningField").empty();
			var maxHours = $("#maxWorkloadInput").val();
			var maxHoursNumber = Number(maxHours);
			var creditsResult = knapSack(courseArray.length - 1, maxHoursNumber);
			console.log(creditsResult);
			
			var optimalCourses = findSums(courseArray, creditsResult);
			listResultItems(optimalCourses);
			$("html, body").animate({
				scrollTop: $("#resultListTable").offset().top
			}, 1000);
		} else {
			$("#warningField").empty();
			$("#warningField").append("<span class='redColor'>Maximum Workload is required!</span>");
		}
	});
	
	// Input validation for maximum workload
	$("#maxWorkloadInput").keypress(function(e) {
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
		var regexName = new RegExp("^[a-zA-Z0-9åÅäÄöÖ ]+( [a-zA-Z0-9]+)*$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regexName.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	$("#creditsInput").keypress(function(e) {
		var regexCredits = new RegExp("^[0-9]+$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regexCredits.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	});
	
	$("#workloadInput").keypress(function(e) {
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
		var creditsTotal = 0;
		var hoursTotal = 0;
		$("#resultListTable").append(
			"<tr>" +
				"<th>Course name</th>" +
				"<th>Credits</th>" +
				"<th>Workload</th>" +
				"<th></th>" +
			"</tr>");
		
		for (var i = 0; i < optimal[0].length; i++) {
			creditsTotal += optimal[0][i].credits;
			hoursTotal += optimal[0][i].hours;
			$("#resultListTable").append(
				"<tr>" +
					"<td>" + optimal[0][i].name + "</td>" +
					"<td>" + optimal[0][i].credits + " cr</td>" +
					"<td>" + optimal[0][i].hours + " h</td>" +
					"<td></td>" +
				"</tr>"
			);
		}
		
		$("#resultListTable").append(
			"<tr>" +
				"<td><span class='bolded'>Total</span></td>" +
				"<td><span class='bolded'>" + creditsTotal + " cr</span></td>" +
				"<td><span class='bolded'>" + hoursTotal + " h</span></td>" +
				"<td></td>" +
			"</tr>"
		);
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
    
	// From here on the code calculates the optimal courses
	// The following code was needed to get the other information (name, hours)...
	// ... from the optimal credits
	// Otherwise we would only have the credits, but wouldn't know which courses...
	// ... were selected
	// Result is returned as an array which contains all the information
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
	
	
	function findSums(courseArray, targetSum) {
		var sumSets = [];
		var optimalSets = [];
		var courseSets = powerset(courseArray);
		for (var i = 0; i < courseSets.length; i++) {
			var courseSet = courseSets[i]; 
			if (sumCredits(courseSet) == targetSum) {
				sumSets.push(courseSet);
			}
		}
		
		for (var i = 0; i < sumSets.length; i++) {
			var sumSet = sumSets[i];
			
			if (sumHours(sumSet) <= $("#maxWorkloadInput").val()) {
				optimalSets.push(sumSet);
			}
		}
		
		console.log(sumSets);
		console.log(optimalSets);
		return optimalSets;
	}
});