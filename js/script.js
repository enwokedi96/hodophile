$(document).ready(
    function () {
        var latitude = "0";
        var longitude = "0";
        var userCityChoice="";
        var currentNumRooms="";
        var currentNumAdults="";
        var currentDestinationID="";
        var orderCriteria = "";
        var userFromDate="";
        var userToDate="";
        const placeOptions = ["city_name", "name", "country"]

        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var userInputManualForm = $("#enter-location") // field to type in destination
        var manualSearch = $('#services-manual');
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
        $('input[type="date"]').attr('min',todaysDate) 
        fromDate.val(todaysDate); toDate.val(tomorrowDate)

        // load keys
        var bookingDotComAPIKey = config["booking-API_KEY"]
        var openWeatherAPIKey = config["openWeather-API_KEY"]

        // add click event for manual search
        manual.on('click', function () {
            manualAuto.addClass('hide')
            manualSearch.removeClass('hide')
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
                "background-size": "cover"
            });
        }

        // sift randomly through images every 3 seconds
        setInterval(changeImage, 3000);

        function callApiDojoBooking(url, apiKey){
            return {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com"
            }
        };}

        // apply to adults event and field
        $("#increase-adults").on("click",function (event){
            // increase count
            var num = parseInt($("#adults").val());
            if (num>=29) {
                console.log("Boi, you can't book higher than number 29!!");
            }
            else {num += 1;}
            // update value
            $("#adults").val(`${num}`);
            currentNumAdults = num;
        })
        $("#decrease-adults").on("click",function (event){
            var num = parseInt($("#adults").val());
            // decrease count
            if (num==1) {
                console.log("Boi, you can't book lower than number one!!");}
            else {num -= 1;}
            // update value
            $("#adults").val(`${num}`);
            currentNumAdults = num;
        })

        // apply to rooms event and field
        $("#increase-rooms").on("click",function (event){
            // increase count
            var num = parseInt($("#rooms").val());
            if (num>=29) {
                console.log("Boi, you can't book higher than number 29!!");}
            else {num += 1;}
            // update value
            $("#rooms").val(`${num}`);
            currentNumRooms = num;
        })
        $("#decrease-rooms").on("click",function (event){
            var num = parseInt($("#rooms").val());
            // decrease count
            if (num==1) {
                console.log("Boi, you can't book lower than number one!!");
            }
            else {num -= 1;}
            // update value
            $("#rooms").val(`${num}`);
            currentNumRooms = num;
        })

        // search for recommentations as user types
        userInputManualForm.on('keyup',function(event){
            event.preventDefault();
            console.log('user filling location');
            var loc = userInputManualForm.val();
            var url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${loc}&languagecode=en-us` //`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${loc}&locale=en-gb`
            // when user input has reached 3 letters and greater, call on api to recommend
            if (loc.length>1){
                $.ajax(callApiDojoBooking(url,bookingDotComAPIKey)).done(
                    function (response) {
                        console.log(response);
                        $("#recommendations").empty()
                        //var recommendations = $("<ul></ul>") //[];
                        for(let i=0; i<response.length; i++){
                            if(i>0||i<response.length-1){$("#recommendations").append("<div class='overline'></div>");}
                            var newOption =  $(`<div class="recommendation-item" id="${i}">`);
                            newOption.append(`${response[i].label}`)
                            $("#recommendations").append(newOption)
                        }
                        // store most current API call
                        setInterval(localStorage.setItem('response',JSON.stringify(response)), 200); 
                        // reveal recommendations
                        $("#recommendations").removeClass('hide') //.append(recommendations);
                    })
            }
            // clear recommendedation field if user goes below 3 letters
            else{
                $("#recommendations").attr('class','hide')
                $("#recommendations").empty();}
        })

        // user picks an option
        $("#recommendations").on('click',function(event){
            var storedResponse = JSON.parse(localStorage.getItem('response'))
            console.log(storedResponse)
            var opt = event.target.id;
            var choice = document.getElementById(opt).innerHTML //$(document).find(`div#${opt}`).val()
            console.log(opt, choice)
            // iteratively check placeOptions for non-empty fields to assign
            for (let i=0; i<placeOptions.length; i++){
                if (storedResponse[opt][placeOptions[i]]!=""){
                    userCityChoice = storedResponse[opt].name;
                    break;
                }
                else{continue}
            }
            currentDestinationID = storedResponse[`${opt}`].dest_id;
            latitude = storedResponse[`${opt}`].latitude
            longitude = storedResponse[`${opt}`].longitude
            console.log(latitude,longitude)
            userInputManualForm.val(choice);
            // clear recommendations
            $("#recommendations").attr('class','hide')
            $("#recommendations").empty();
        })

        // listen for both date fields
        fromDate.on("change",function(){
            userFromDate = fromDate.val();
            console.log(userFromDate,userToDate)
            // update the to-date field (help keep user on the straight and narrow path)
            var newProposedToDate = moment(userFromDate,"YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
            toDate.val(newProposedToDate);
        })
        toDate.on("change",function(){
            userToDate = toDate.val();
            console.log(userFromDate,userToDate)
            var compareUserFromDate = new Date(userFromDate)
            var compareUserToDate = new Date(userToDate)
            // code distruptors: from-date should be less than to-date
            if (compareUserFromDate<compareUserToDate){
                console.log('all good')
            }
            else if (compareUserFromDate>compareUserToDate){
                console.log('errrorrr!!! should be less than');
                toDate.val("err")
            }
            else if (compareUserFromDate==compareUserToDate){
                console.log('errrorrr!!! check dates! should be less than')
                toDate.val("err")
            }
        })

        // listen on the order criteria
        orderCriteriaTag.on("change", function(){
            orderCriteria = orderCriteriaTag.val();
            //console.log(orderCriteria, );
            // if user doesn't pick, default is set to price
            if (orderCriteria.split(' ').length>1){
                console.log('default chosen: price');
                orderCriteria = "price";
            }
        })

        // listen for submit field on manual ops
        submitSearch.on("click", function(){
            console.log('user initiating search');
            // repeat necessary check outside individual events
            userToDate = toDate.val();
            userFromDate = fromDate.val();
            currentNumAdults = $("#adults").val()
            currentNumRooms = $("#rooms").val();
            orderCriteria = orderCriteriaTag.val();
            if (orderCriteria.split(' ').length>1){
                    console.log('default chosen: price');
                    orderCriteria = "price";
                }
            var url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${userFromDate}&departure_date=${userToDate}&guest_qty=${currentNumAdults}&dest_ids=0&room_qty=${currentNumRooms}&search_type=latlong&children_qty=2&children_age=5%2C7&search_id=none&price_filter_currencycode=USD&latitude=${latitude}&longitude=${longitude}&order_by=${orderCriteria}&languagecode=en-us&travel_purpose=leisure`;
            console.log(url,bookingDotComAPIKey);
            $("#spinner").css("visibility", "visible");

            // call API: check for rooms
            $.ajax(callApiDojoBooking(url,bookingDotComAPIKey))
            .done(
                function (response) {
                    // hide spin once api json is loaded
                    console.log(response)
                    $("#spinner").css("visibility", "hidden");
                    var num = Object.keys(response).length;
                    
                    // check if error or hit
                    if (num>3){
                        // if place exists but no results are found
                        if (Object.keys(response.result).length==0){
                            searchResults.append(`<div class="moving-center">${response.zero_results_message.messages[0]}</div>`);
                        }
                        // place exists and there are accommodations in the area
                        else {
                            console.log(totNumResults)
                            var totNumResults = Object.keys(response.result).length;
                            searchResults.empty();
                            for (let i=0; i<totNumResults; i++){
                                var newResult = $(`<div class="results" id="result-${i}"></div>`);
                                // add each result head, containing image, name and review
                                var imgPlusHotelName = $("<div class='result-head'></div>");
                                console.log(response.result[i].main_photo_url)
                                var img = $(`<img>`); img.attr('src',`${response.result[i].main_photo_url}`)
                                // load review scores
                                var score_num = response.result[i].review_score
                                if (score_num.length==1){score_num += ".0"}
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
                                title.prepend(img); title.prepend(`${i+1}. `)
                                imgPlusHotelName.append(title)
                                imgPlusHotelName.append(review_score); 
                                newResult.append(imgPlusHotelName); newResult.append(address); newResult.append(cost)
                                searchResults.append(newResult);
                            }
                        }
                    }
                    else {
                        searchResults.append(`<div class="moving-center">${response.message}</div>`);
                    }
                })
            // reveal search results
            manualSearch.addClass('hide');
            manualAuto.addClass('hide');
            searchResultsContainer.removeClass('hide');
        })

        // add click event to close search results
        closeSearch.on('click', function () {
            searchResults.empty();
            manualSearch.removeClass('hide');
            searchResultsContainer.addClass('hide');
            manualAuto.addClass('hide');
            // reset counters
            $("#adults").val(`1`); $("#rooms").val(`1`)
            userInputManualForm.val("")
        })

        }
    )
