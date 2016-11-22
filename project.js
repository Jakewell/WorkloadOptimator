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
					"<td><i id='xButtonID" + i + "' class='fa fa-times fa-lg xButton' aria-hidden='true'></i></td>" +
				"</tr>"

	$("#plusButton").on("click", function() {
		if ( !($("#courseNameInput").val() && $("#creditsInput").val() && $("#workloadInput").val()) ) {
			return;
		} else {
			var nameValue = $("#courseNameInput").val();
			var creditsValue = $("#creditsInput").val();
			var workValue = $("#workloadInput").val();
            
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
		$("#courseListTable").empty();
		listCourseItems();
	});
	
	// Calculate the optimal courses
	// Knapsack function ->
	// Pass the returned optimal credits to findSums function ->
	// List the returned courses from the optimalSets array
	$("#calculateButton").on("click", function() {
		$("#resultListTable").empty();
        var maxHours = $("#maxWorkloadInput").val();
        var maxHoursNumber = Number(maxHours);
		var creditsResult = knapSack(courseArray.length - 1, maxHoursNumber);
		console.log(creditsResult);
		
		var optimalCourses = findSums(courseArray, creditsResult);
		listResultItems(optimalCourses);
		$("html, body").animate({
			scrollTop: $("#resultListTable").offset().top
		}, 1000);
	});
	
	// Display the optimal results in a new table
	function listResultItems(optimal) {
		$("#resultListContainer h3").html("Optimal Courses");
		$("#resultListTable").append(
			"<tr>" +
				"<th>Course name</th>" +
				"<th>Credits</th>" +
				"<th>Workload</th>" +
				"<th></th>" +
			"</tr>");
		
		for (var i = 0; i < optimal[0].length; i++) {
			$("#resultListTable").append(
				"<tr>" +
					"<td>" + optimal[0][i].name + "</td>" +
					"<td>" + optimal[0][i].credits + " cr</td>" +
					"<td>" + optimal[0][i].hours + " h</td>" +
					"<td></td>" +
				"</tr>"
			);
		}
	}
	
	// Calculate the actual problem case by using course credits

        var maxHours = $("#maxWorkloadInput").val();
        var maxHoursNumber = Number(maxHours);
		var result = knapSack(courseArray.length - 1, maxHoursNumber);
		console.log(result);
		console.log(findSums(courseArray, result));
	});
	

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

			if (sumCredits(courseSet) == targetSum)
				sumSets.push(courseSet);

		}
		
		for (var i = 0; i < sumSets.length; i++) {
			var sumSet = sumSets[i];
			

			if (sumHours(sumSet) <= $("#maxWorkloadInput").val()) {
				optimalSets.push(sumSet);
			}
		}
		
		console.log(sumSets);
		console.log(optimalSets);

			if (sumHours(sumSet) <= 200)
				optimalSets.push(sumSet);
		}
		
		console.log(sumSets);
		return optimalSets;
	}
});
