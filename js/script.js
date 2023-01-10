$(document).ready(
    function () {
        var manualOrAutoChoice = ""
        var latitude = "0";
        var longitude = "0";
        var chosenCoordinates=[];
        var userHemisphere = "";
        var currentNumRooms = "";
        var currentNumAdults = "";
        var orderCriteria = "";
        var userFromDate = "";
        var userToDate = "";
        var IsAPIDojoFinished = false;
        const numCountries = 6;
        const placeOptions = ["city_name", "name", "country"]

        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var auto = $("#automatic"); // auto button
        var userInputManualForm = $("#enter-location"); // field to type in destination
        var recommendationList = $("#recommendations");
        var manualSearch = $('#services-manual'); // all things searchwise
        var closeManual = $("#close"); // close button - inputs
        var closeSearch = $("#close-results"); // close button - search res
        const imageTag = $('#image') // tag attached to body
        var fromDate = $("#from-date"); // input field for start date
        var toDate = $("#to-date"); // input field for end date
        var orderCriteriaTag = $("#order-options");
        var searchResultsContainer = $("#search-results-all")
        var searchResults = $("#search-results");
        var submitSearch = $("#submit-search");
        var todaysDate = moment().format("YYYY-MM-DD");
        var tomorrowDate = moment().add(1, 'days').format("YYYY-MM-DD");

        // set both date fields to default to current/next day
        $('input[type="date"]').attr('min', todaysDate)
        fromDate.val(todaysDate); toDate.val(tomorrowDate)

        // load keys
        var bookingDotComAPIKey = config["booking-API_KEY"]
        var openWeatherAPIKey = config["openWeather-API_KEY"]

        // load cities
        var allCities = cities;

        // Optimal reusability: listen to div to ascertain which top of form to use
        // whilst other form elements are reused
        manualAuto.on('click', function (event) {
            manualOrAutoChoice = event.target.id;
            console.log(`now exploring ${manualOrAutoChoice} form`);
            if (manualOrAutoChoice=="manual"){
                $("#auto-top-form").addClass('hide');
                $("#manual-top-form").removeClass('hide');
            }
            else if (manualOrAutoChoice=="automatic"){
                $("#manual-top-form").addClass('hide');
                $("#auto-top-form").removeClass('hide');
                // clear previous user select options and make sure button's enabled
                $("#choose-hemisphere-button").prop('disabled', false);
                $("#hemisphere-dropdown-all div").empty();
            }
        })

        // add click event for manual button
        manual.on('click', function () {
            manualAuto.addClass('hide');
            manualSearch.removeClass('hide');
        })
        // click event for auto
        auto.on('click', function () {
            manualAuto.addClass('hide');
            manualSearch.removeClass('hide');
        })

        // when hemisphere value changes, get val, disable and reveal next div
        $("#dropdown-menu-hemisphere").on('click', 
        function (event) {
            userHemisphere = event.target.innerHTML;
            console.log(userHemisphere)
            $("#choose-hemisphere-button").dropdown("toggle");
            $("#choose-hemisphere-button").prop('disabled', true);
            $("#hemisphere-dropdown-all").append (`<div> <strong>user choice:</strong> ${userHemisphere}</div>`);
        })

        // add click event for manual search
        closeManual.on('click', function () {
            manualSearch.addClass('hide');
            manualAuto.removeClass('hide');
            // reset counters
            $("#adults").val(`1`); $("#rooms").val(`1`)
        })

        // image transitions in the background
        function changeImage() {
            const images = [
                'url("./images/egypt.jpg")',
                'url("./images/egypt1.jpg")',
                'url("./images/italy2.jpg")',
                'url("./images/maldives1.jpg")',
                'url("./images/paris.jpg")',
                'url("./images/italy-rome-colosseum.jpg")',
                'url("./images/peru.jpg")',
                'url("./images/masai-mara-kenya.jpg")',
                'url("./images/statue-of-liberty-us.jpg")',

            ]

            const bg = images[Math.floor(Math.random() * images.length)];
            imageTag.css({
                "background-image": bg,
                "background-size": "cover",
                "background-repeat":"no-repeat",
            });
        }

        // sift randomly through images every 3 seconds
        setInterval(changeImage, 3000);

        function callApiDojoBooking(url, apiKey, async=true) {
            return {
                "async": async,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com"
                }
            };
        }

        function bookingDotCom(url, apiKey){
            return {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
                }
            };
        }

        // apply to adults event and field
        $("#increase-adults").on("click", function (event) {
            // increase count
            var num = parseInt($("#adults").val());
            if (num >= 29) {
                console.log("Boi, you can't book higher than number 29!!");
            }
            else { num += 1; }
            // update value
            $("#adults").val(`${num}`);
            currentNumAdults = num;
        })
        $("#decrease-adults").on("click", function (event) {
            var num = parseInt($("#adults").val());
            // decrease count
            if (num == 1) {
                console.log("Boi, you can't book lower than number one!!");
            }
            else { num -= 1; }
            // update value
            $("#adults").val(`${num}`);
            currentNumAdults = num;
        })

        // apply to rooms event and field
        $("#increase-rooms").on("click", function (event) {
            // increase count
            var num = parseInt($("#rooms").val());
            if (num >= 29) {
                console.log("Boi, you can't book higher than number 29!!");
            }
            else { num += 1; }
            // update value
            $("#rooms").val(`${num}`);
            currentNumRooms = num;
        })
        $("#decrease-rooms").on("click", function (event) {
            var num = parseInt($("#rooms").val());
            // decrease count
            if (num == 1) {
                console.log("Boi, you can't book lower than number one!!");
            }
            else { num -= 1; }
            // update value
            $("#rooms").val(`${num}`);
            currentNumRooms = num;
        })

        // search for recommentations as user types
        userInputManualForm.on('keyup', function (event) {
            event.preventDefault();
            console.log('user filling location');
            var loc = userInputManualForm.val();
            var url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${loc}&languagecode=en-us` //`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${loc}&locale=en-gb`
            // when user input has reached 3 letters and greater, call on api to recommend
            if (loc.length > 1) {
                $.ajax(callApiDojoBooking(url, bookingDotComAPIKey)).done(
                    function (response) {
                        //console.log(response);
                        recommendationList.empty()
                        //var recommendations = $("<ul></ul>") //[];
                        for (let i = 0; i < response.length; i++) {
                            if (i > 0 || i < response.length - 1) { recommendationList.append("<div class='overline'></div>"); }
                            var newOption = $(`<div class="recommendation-item" id="${i}">`);
                            newOption.append(`${response[i].label}`)
                            recommendationList.append(newOption)
                        }
                        // store most current API call
                        setInterval(localStorage.setItem('response', JSON.stringify(response)), 200);
                        // reveal recommendations
                        recommendationList.removeClass('hide') //.append(recommendations);
                    })
            }
            // clear recommendedation field if user goes below 3 letters
            else {
                recommendationList.attr('class', 'hide')
                recommendationList.empty();
            }
        })

        // user picks an option
        recommendationList.on('click', function (event) {
            var storedResponse = JSON.parse(localStorage.getItem('response'))
            //console.log(storedResponse)
            var opt = event.target.id;
            var choice = document.getElementById(opt).innerHTML //$(document).find(`div#${opt}`).val()
            //console.log(opt, choice)
            // iteratively check placeOptions for non-empty fields to assign
            for (let i = 0; i < placeOptions.length; i++) {
                if (storedResponse[opt][placeOptions[i]] != "") {
                    userCityChoice = storedResponse[opt].name;
                    break;
                }
                else { continue }
            }
            currentDestinationID = storedResponse[`${opt}`].dest_id;
            latitude = storedResponse[`${opt}`].latitude
            longitude = storedResponse[`${opt}`].longitude
            console.log(latitude, longitude)
            userInputManualForm.val(choice);
            // clear recommendations
            recommendationList.attr('class', 'hide')
            recommendationList.empty();
        })

        // listen for both date fields
        fromDate.on("change", function () {
            userFromDate = fromDate.val();
            //console.log(userFromDate,userToDate)
            // update the to-date field (help keep user on the straight and narrow path)
            var newProposedToDate = moment(userFromDate, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
            toDate.val(newProposedToDate);
        })
        toDate.on("change", function () {
            userToDate = toDate.val();
            var compareUserFromDate = new Date(userFromDate)
            var compareUserToDate = new Date(userToDate)
            // code distruptors: from-date should be less than to-date
            if (compareUserFromDate < compareUserToDate) {
                console.log('all good')
            }
            else if (compareUserFromDate > compareUserToDate) {
                console.log('errrorrr!!! should be less than');
                toDate.val("err")
            }
            else if (compareUserFromDate == compareUserToDate) {
                console.log('errrorrr!!! check dates! should be less than')
                toDate.val("err")
            }
        })

        // listen on the order criteria
        orderCriteriaTag.on("change", function () {
            orderCriteria = orderCriteriaTag.val();
            // if user doesn't pick, default is set to price
            if (orderCriteria.split(' ').length > 1) {
                console.log('default chosen: price');
                orderCriteria = "price";
            }
        })

        // listen for submit field on manual ops
        submitSearch.on("click", function () {
            console.log('user initiating search');
            // repeat necessary check outside individual events
            userToDate = toDate.val();
            userFromDate = fromDate.val();
            currentNumAdults = $("#adults").val()
            currentNumRooms = $("#rooms").val();
            orderCriteria = orderCriteriaTag.val();
            if (orderCriteria.split(' ').length > 1) {
                console.log('default chosen: price');
                orderCriteria = "price";
            }
            $("#spinner").css("visibility", "visible");
            // all manual ops
            if (manualOrAutoChoice=="manual"){   
                var url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${userFromDate}&departure_date=${userToDate}&guest_qty=${currentNumAdults}&dest_ids=0&room_qty=${currentNumRooms}&search_type=latlong&children_qty=2&children_age=5%2C7&search_id=none&price_filter_currencycode=USD&latitude=${latitude}&longitude=${longitude}&order_by=${orderCriteria}&languagecode=en-us&travel_purpose=leisure`;
                
                // call API: check for rooms
                $.ajax(callApiDojoBooking(url, bookingDotComAPIKey))
                    .done(
                        function (response) {
                            // hide spin once api json is loaded
                            $("#spinner").css("visibility", "hidden");
                            var num = Object.keys(response).length;

                            // check if error or hit
                            if (num > 3) {
                                IsAPIDojoFinished = true;
                                // if place exists but no results are found
                                if (Object.keys(response.result).length == 0) {
                                    searchResults.append(`<div class="moving-center">${response.zero_results_message.messages[0]}</div>`);

                                }
                                // place exists and there are accommodations in the area
                                else {
                                    var totNumResults = Object.keys(response.result).length;
                                    searchResults.empty();
                                    for (let i = 0; i < totNumResults; i++) {
                                        var newResult = $(`<div class="results" id="result-${i}"></div>`);
                                        // add each result head, containing image, name and review
                                        var imgPlusHotelName = $("<div class='result-head'></div>");
                                        var img = $(`<img>`); img.attr('src', `${response.result[i].main_photo_url}`)
                                        // load review scores
                                        var score_num = response.result[i].review_score;
                                        console.log(score_num, score_num.length)
                                        if (score_num.length == 1) { score_num += ".0" }
                                        var score = $(`<div class="hotel-scores force-inline">${score_num}</div>`)
                                        var review_score = $('<div class="align-review-right">'); review_score.append(score)
                                        review_score.append(`<div class="force-inline">${response.result[i].review_score_word}</div>`)
                                        var title = $(`<h5><a class="hotel-name"  target="_blank" href=${response.result[i].url}> ${response.result[i].hotel_name_trans}</a></h5>`);
                                        // add address
                                        // <strong>Address:</strong> 
                                        var address = $(`<div class="moving-center">${response.result[i].address}, ${response.result[i].city}</div>`);
                                        // add estimated cost
                                        var cost = $(`<div class="moving-center"><strong>Estimated Cost (all-inclusive):</strong> ${response.result[i].price_breakdown.all_inclusive_price} ${response.result[i].price_breakdown.currency}</div>`)
                                        // append search elements
                                        title.prepend(img); title.prepend(`${i + 1}. `)
                                        imgPlusHotelName.append(title)
                                        imgPlusHotelName.append(review_score);
                                        newResult.append(imgPlusHotelName); newResult.append(address); newResult.append(cost)
                                        searchResults.append(newResult);
                                    }
                                    IsAPIDojoFinished = true;
                                }

                                // load weather and forecasts using longitude and latitude
                                // for weather ops
                                var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPIKey}`;

                                if (IsAPIDojoFinished == true) {
                                    console.log('now fetching weather')
                                    $.ajax({
                                        url: queryURL,
                                        method: "GET"
                                    }).done(function (response) {
                                        console.log(response)
                                        searchCity = `${response.city.name}`;

                                        var tableWeather = $("<table id='todayTable'></table>");
                                        tableWeather.css({ 'table-layout': 'fixed', 'width': '100%' })

                                        // loop rows and display times, weather conditions and values
                                        var weatherUnits = ['', '%', '°C', 'kph'];
                                        var weatherConditions = ['', 'Humidity', 'Temp', 'Wind']
                                        for (let j = 0; j < weatherConditions.length; j++) {
                                            var nrow = $('<tr>')
                                            if (j == 0) { nrow.append('<th></th>'); }
                                            else { nrow.append(`<td>${weatherConditions[j]}: </td>`); }
                                            // loop all available forecasts for today
                                            for (let k = 0; k < response.list.length; k++) {
                                                var splitDatetime = response.list[k].dt_txt.split(/(\s+)/);
                                                // headers for time
                                                if (splitDatetime[2] != '12:00:00') { continue; }
                                                else {
                                                    // on first row, load date, time and weather icon
                                                    if (j == 0) {
                                                        var iconCode = `${response.list[k].weather[0].icon}`;
                                                        var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;
                                                        var iconImg = `<img class='icons' src="${iconURL}" alt="Weather icon">`;
                                                        var headPlusImg = $(`<th class="moving center"></th>`);
                                                        headPlusImg.append(`<div>${splitDatetime[0]}</div>`)
                                                        headPlusImg.append(`${splitDatetime[2].slice(0, 5)}`);
                                                        headPlusImg.append(iconImg);
                                                        nrow.append(headPlusImg);
                                                    }
                                                    // load wind conditions
                                                    else if (j == 3) {
                                                        nrow.append(`<td>${response.list[k][weatherConditions[j].toLowerCase()].speed}${weatherUnits[j]}</td>`);
                                                    }
                                                    // load other weather conditions
                                                    else {
                                                        var weatherVal = response.list[k].main[weatherConditions[j].toLowerCase()];
                                                        // convert kelvin to degree celcius
                                                        if (weatherConditions[j] == 'Temp') {
                                                            weatherVal = Math.round(((parseFloat(weatherVal) - 273.15) + Number.EPSILON) * 100) / 100;
                                                        }
                                                        nrow.append(`<td>${weatherVal}${weatherUnits[j]}</td>`);
                                                    }
                                                }

                                            }
                                            // append relevant headers and weather content into col
                                            tableWeather.append(nrow);
                                        }
                                        $("#weather-results").append(tableWeather)
                                        $("#weather-results-all").removeClass('hide');
                                    }
                                    )
                                }
                            }
                            else {
                                searchResults.append(`<div class="moving-center">${response.message}</div>`);
                                IsAPIDojoFinished = true;
                            }
                        })
                // reveal search results
                manualSearch.addClass('hide');
                manualAuto.addClass('hide');
                searchResultsContainer.removeClass('hide');}

            // all auto ops
            else if (manualOrAutoChoice=="automatic"){
                latitude = ""; longitude = "";
                // remove auto form
                manualSearch.addClass('hide');
                $("#city-results-all").removeClass('hide');

                // get random places from list
                var randomlySelectCities=[]
                for (var i=0; i<Object.keys(allCities).length; i++){
                    var currentCityKey = Object.keys(allCities)[i];
                    var currentRegionOfSearch = allCities[currentCityKey];
                    var randomPick = currentRegionOfSearch[Math.floor(Math.random()*currentRegionOfSearch.length)];
                    randomlySelectCities.push(randomPick);
                }
                console.log(randomlySelectCities)

                // display randomly selected cities unto screen
                var middleIndex = Math.ceil(randomlySelectCities.length / 2);
                var firstHalfCities = randomlySelectCities.slice().splice(0, middleIndex);   
                var secondHalfCities = randomlySelectCities.slice().splice(-middleIndex);
                const timer = ms => new Promise(res => setTimeout(res, ms))
                function appendNewCity(rowID,getCityInfoURL){
                    $.ajax(bookingDotCom(getCityInfoURL, bookingDotComAPIKey)).done(
                        function (response) {
                            console.log(response);
                            localStorage.setItem(response[0].city_name, JSON.stringify({"lat":response[0].latitude,"long":response[0].longitude}));
                            var nextCity = $("<div class='city-images'>");
                            var cityImg = $(`<img src=${response[0].image_url}>`);
                            //cityImg.css("background-image",`url(${response[0].image_url})`);
                            nextCity.append(cityImg);
                            nextCity.append(response[0].city_name);
                            $(rowID).append(nextCity)
                        }
                    );
                }

                async function runLoop(){
                    for (var i=0; i<firstHalfCities.length; i++){
                        console.log("Now searching: ",firstHalfCities[i])
                        var getCityInfoURL = `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${firstHalfCities[i]}&locale=en-gb` //`https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${firstHalfCities[i]}&languagecode=en-gb`
                        // call API: check for LOCATION
                        appendNewCity("#search-cities-1",getCityInfoURL);
                        await timer(1100)
                    }
                }

                runLoop();

                $("#search-cities-1").removeClass('hide')

                // var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${chosenPlace}&limit=5&appid=${openWeatherAPIKey}`
                // get coordinates 
                
            }

        })

        // add click event to close search results
        closeSearch.on('click', function () {
            searchResults.empty();
            $("#weather-results").empty()
            manualSearch.removeClass('hide');
            searchResultsContainer.addClass('hide');
            $("#weather-results-all").addClass('hide');
            manualAuto.addClass('hide');
            $("#spinner").css("visibility", "hidden");
            // reset counters
            $("#adults").val(`1`); $("#rooms").val(`1`);
            userInputManualForm.val("");
        })

    }
    
)
