$(document).ready(function(){

	// Stores object returned from Farmsense $.getJSON
	// Meets datastructure requirement
	var eventData = [];

	var valid_longitude;
	var valid_latitude;
	var lat;
	var long;
	var regex = /^(\-?\d+(\.\d+)?)$/;
	var inputs=[];

	// Allow user to mannually enter longitude & latitude if no geolocation
	// Meets DOM manipulation requirement
	function showManual(){
		console.log("showmanual started")
		$("#go").hide();
	    $("#text").css("display", "none");
		$("#error").append("<p>Your location information is unavailable or you have blocked it. Please enter the longitude and latitude in the fields below. If you don't know your coordinates, you can find them <a href='http://www.latlong.net/convert-address-to-lat-long.html' target='_blank'>here.</a></p>");
		$("#error").append("<form id='form_coord'><form>");
		$("#form_coord").append("<label for='longitude'>Enter Longitude<label>");
		$("#form_coord").append("<div id='long_container'></div>");
		$("#form_coord").append("<input type='text' id='form_long' placeholder='longitude'/><br />");
		$("#form_coord").append("<label for='latitude'>Enter Latitude<label>");
		$("#form_coord").append("<div id='lat_container'></div>");
		$("#form_coord").append("<input type='text' id='form_lat' placeholder='latitude'/><br />");
		$("#form_coord").append("<input type='submit' id='form_button' value='Submit'/><br /><br />");


		// Validates user input for longitude and latitude
		// Meets validation requirement

		// $("#form_lat").focusout(function(event){
		// 	lat = $(this).val();
		// 	console.log(lat);
		// 	if (!(regex.test(lat))){
		// 		$("#lat_container").html("<p id='lat_valid'>Please enter a valid latitude</p>");
		// 		valid_latitude = false;
		// 	}
		// 	else {
		// 		$("#lat_container").html("");
		// 		valid_latitude = true;
		// 	}
		// 	event.stopPropagation();
		// });

		$("#form_lat").mousedown(function(event){
			lat = $(this).val();
			console.log(lat);
			if (!(regex.test(lat))){
					$("#lat_container").html("<p id='lat_valid'>Please enter a valid latitude</p>");
					valid_latitude = false;
				}
				else {
					$("#lat_container").html("");
					valid_latitude = true;
					//$("#form_coord").submit(event);
				}
			event.stopPropagation();
		});

		// $("#form_long").focusout(function(event){
		// 	long = $(this).val();
		// 	console.log(long);
		// 	//var long_regex = /^(\-?\d+(\.\d+)?)$/;
		// 	if (!(regex.test(long))){
		// 		$("#long_container").html("<p id='long_valid'>Please enter a valid Longitude</p>");
		// 		valid_longitude = false;
		// 	} else {
		// 		valid_longitude = true;
		// 		$("#long_container").html("");
				
		// 	}
		// 	event.stopPropagation();
		// });

		$("#form_long").mousedown(function(event){
			long = $(this).val();
			console.log(long);
			if (!(regex.test(long))){
					$("#lat_container").html("<p id='lat_valid'>Please enter a valid latitude</p>");
					valid_longitude = false;
				}
				else {
					$("#lat_container").html("");
					valid_longitude = true;
					//$("#form_coord").submit(event);
				}
			event.stopPropagation();
		});

		$("#form_button").focusin(function(event) {
	    	var related = event.relatedTarget;
	    	if(related && related.tagName == "INPUT") {
	        	$("#form_coord").submit();
	    	}   
		}); 

		// There is no need to submit form to server because the data isn't leaving the page.

		$("#form_coord").submit(function(event){
			console.log("lat: " + valid_latitude + " long: " + valid_longitude);
			inputs[0]=$("#form_long").val();
			inputs[1]=$("#form_lat").val();
			if (valid_longitude && valid_latitude){
				displayStations(inputs);

			} else {

			}
			event.stopPropagation();
			return false;
		});
	}
	

	//Start the process
	function getLocation() {
	    if (!navigator.geolocation) {	        
	        showManual();

	    } else {
	        navigator.geolocation.getCurrentPosition(success, error);
	    }
	}

	function error() {
		showManual();
	};

	// If geolocation successful develop coordinates, convert to simple array.
	// Takes in object from getCurrentPosition
	function success(position){
		console.log(position);
		var longitude=position.coords.longitude;
		var latitude=position.coords.latitude;
		var coordinates=[longitude, latitude]; 
		displayStations(coordinates);
	}

	// Displays weather stations
	// Takes in coordinates array
	// Meets AJAX requirement
	function displayStations(coordinates){
		$("#form_coord").hide();
		$("#risk").css("display", "block");
		$("#pick").css("display", "block");
		var longitude=coordinates[0];
		var latitude=coordinates[1];
		var url = "http://farmsense-prod.apigee.net/v1/frostdates/stations/?lat=" + latitude + "&lon=" + longitude;
		$.getJSON(url, function (data){
			$.each(data, function(key, val){
				var name = val.name;
				name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
					return letter.toUpperCase(); // Take all caps & transform to capitalize
				});
				var distance = parseFloat(val.distance);
				distance =distance.toFixed(2);
				var id = val.id;
				//console.log(id);
				$("#location").append("<input type='radio' name='station_radio' value='" + id + "' />");
				$("#location").append("<label for='radio'>" + name + " (" + distance + " miles from you)</label><br />");
			}); //end each
		}); // end getJSON
		displaySafty();
	}

	// Displays safty options
	function displaySafty(){
		$("#go").hide();
		$("#safty").append("<input type='radio' value='safty1' name='safty_value' />");
		$("#safty").append("<label for='safty1'>Provide a last frost date that is historically very safe, but later in the spring.</label><br />");
		$("#safty").append("<input type='radio' value='safty2' name='safty_value' />");
		$("#safty").append("<label for='safty2'>Provide a last frost date that is historically somewhat safe, but a little earlier in the spring.</label><br />");
		$("#safty").append("<input type='radio' value='safty3' name='safty_value' />");
		$("#safty").append("<label for='safty3'>Provide a last frost date that is historically aggressive, but earlier in the spring.</label><br />");
	}

	// Clears radio buttons for when the user wants to use old data again
	function useOldData(){
		$("#risk").css("display", "block");
		$("#pick").css("display", "block");
		$("#text").css("display", "none");
		$("#date").css("display", "none");
		$('input[name="station_radio"]').prop('checked', false);
		$('input[name="safty_value"]').prop('checked', false);
	}


	// Captures station selection
	// Push to array of objects
	// Meets listener requirement
	$("#location").change(function() {
		$("#pick").hide();
		var id = $("input[name='station_radio']:checked").val();
		var url = "http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=" + id + "&season=1";
		$.getJSON(url, function (data){
			$.each(data, function(i, v){
				eventData.push(data[i]);
			});
		});
		$("#safty").focus();
	});

	// Displays date in red box
	// Takes in date
	function displayDate(date_string){
		$("#date").html(date_string).css("display", "block").focus;
	}

	// Stores date in local storage
	// Takes in date from Farmsense
	function storeDate(date_string){
		window.localStorage.setItem('full_date', date_string);
	}

	// Displays date  in alert when user returns to page
	// I think this is a better way to display past info than in html
	function welcomeBack(){
		var full_date = window.localStorage.getItem('full_date');
		if(full_date != undefined){
			alert("Welcome back! The last frost date you calculated previously was " + full_date + ". Click OK to do it again.");
			window.localStorage.removeItem('full_date');
		}
	}

	// Converts date from Farmsense into spelled out month and day
	// Takes in date from Farmsense
	function convertDate(date_string){
		var month = date_string.substr(0, 2);
		switch (month) { 
    		case '01': 
        	month = 'January';
        	break;

	    	case '02': 
        	month = 'February';
	        break;

	        case '03': 
        	month = 'March';
	        break;

	        case '04': 
        	month = 'April';
	        break;

	        case '05': 
        	month = 'May';
	        break;

	        case '06': 
        	month = 'June';
	        break;

	        case '07': 
        	month = 'July';
	        break;

	        case '08': 
        	month = 'August';
	        break;

	        case '09': 
        	month = 'September';
	        break;

	        case '10': 
        	month = 'October';
	        break;

	        case '11': 
        	month = 'November';
	        break;

	        default: 
        	month = 'December';
	        break;
		}

		var day = Number(date_string.substr(2, 2)).toString();
		var full_date = month + " " + day;
		var date_string = "<p id='focus'>Based on your selections, your spring last frost date is: <br /><strong>" + full_date + "</strong></p>."
		displayDate(date_string);
		storeDate(full_date);
		$("#go_again").css("display", "block");
		$("#restart").css("display", "block");
		$("div#error p").hide();
		
		// Listener for Clear Selection
		$("#go_again").click(function(){
			window.localStorage.removeItem('full_date');
			useOldData();
		});

		//Listener for restart the process
		$("#restart").click(function(){
			window.localStorage.removeItem('full_date');
			// Reload NOT from cache while in development
			location.reload(true);
		});
	}

	// Listener for Safty radio buttons
	$("#safty").change(function() {

		var safty = $("input[name='safty_value']:checked").val();
		switch (safty) { 
			// Allows user to select probability data
    		case 'safty1': 
        	var frost_str = eventData[1].prob_50;
        	break;

	    	case 'safty2': 
	        var frost_str = eventData[1].prob_60;
	        break;

    		default: 
        	var frost_str = eventData[1].prob_80;
		}
		convertDate(frost_str);
	});
	
	welcomeBack();

	$("#go").on("click", function(){
		getLocation();
	});

});