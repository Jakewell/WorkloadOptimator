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
	
	var maxHours = 200;
	var nameArray = [];
	var creditsArray = [];
	var hoursArray = [];
	
	for (i = 0; i < courseArray.length; i++) {
		nameArray.push(courseArray[i].name);
		creditsArray.push(courseArray[i].credits);
		hoursArray.push(courseArray[i].hours);
	}
	
	for (j = 0; j < courseArray.length; j++) {
		$("table").append("<tr>" +
							"<td>" + nameArray[j] + "</td>" +
							"<td><input class='creditsInput' type='text' size='5' maxlength='2'> cr</td>" +
							"<td>" + hoursArray[j] + " h</td>" +
						  "</tr>"
		);
	}
	
	var newCreditsArray = [];
	
	$("#calculateButton").on("click", function() {
		newCreditsArray = [];
		$(".creditsInput").each(function() {
			newCreditsArray.push(Number(this.value));
		});
		console.log(newCreditsArray);
		console.log( knapSack(newCreditsArray.length - 1, maxHours) );
	});
    
    function knapSack(a, b) {
        if (a < 0) {
            return 0;
        }
        
        if (hoursArray[a] > b) {
            return knapSack(a - 1, b);
        } else {
            return Math.max( knapSack(a - 1, b), knapSack(a - 1, b - hoursArray[a]) + newCreditsArray[a] );
        }
    }
});