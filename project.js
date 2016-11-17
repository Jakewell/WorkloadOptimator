$(function() {
    
    /* SOURCES
	http://stackoverflow.com/questions/7774769/how-do-i-solve-the-classic-knapsack-algorithm-recursively
	*/
    
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
	
    $("#maxWorkloadInput").val(200);
	
	listCourseItems();
	
	function listCourseItems() {
		$("#courseListTable").append("<tr>" +
							"<th>Course name</th>" +
							"<th>Credits</th>" +
							"<th>Workload</th>" +
							"</tr>");
		
		for (i = 0; i < courseArray.length; i++) {
			$("#courseListTable").append("<tr>" +
                "<td>" + courseArray[i].name + "</td>" +
                "<td>" + courseArray[i].credits + " cr</td>" +
                "<td>" + courseArray[i].hours + " h</td>" +
                "<td><i id='xButtonID" + i + "' class='fa fa-times fa-lg xButton' aria-hidden='true'></i></td>" +
            "</tr>"
			);
		}
	}
	
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
	
	$("#courseListTable").on("click", ".xButton", function() {
        var currentPos = $(this).attr("id");
        var currentButtonID = currentPos.slice(9);
        courseArray.splice(currentButtonID, 1);
		$("#courseListTable").empty();
		listCourseItems();
        //console.log(courseArray);
	});
	
	$("#calculateButton").on("click", function() {
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
			if (sumCredits(courseSet) == targetSum)
				sumSets.push(courseSet);
		}
		
		for (var i = 0; i < sumSets.length; i++) {
			var sumSet = sumSets[i];
			
			if (sumHours(sumSet) <= 200)
				optimalSets.push(sumSet);
		}
		
		console.log(sumSets);
		return optimalSets;
	}
});