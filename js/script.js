$(document).ready(
    function () {
        var latituide = "";
        var longitude = "";
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
        var manualSearch = $('#services-manual');
        var submitManualSearch = $("#submit-manual-search")
        var closeManual = $("#close"); // close button
        const imageTag = $('#image') // tag attached to body
        var fromDate = $("#from-date"); // input field for start date
        var toDate = $("#to-date"); // input field for end date
        var orderCriteriaTag = $("#order-options");
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

        // settings for api calls to assist
        function callBookingDotCom(url, apiKey){
            return {"async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
            }}
        };

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
        $("#enter-location").on('keyup',function(event){
            event.preventDefault();
            console.log('user filling location');
            var loc = $("#enter-location").val();
            var url = `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${loc}&locale=en-gb`
            // when user input has reached 3 letters and greater, call on api to recommend
            if (loc.length>2){
                $.ajax(callBookingDotCom(url,bookingDotComAPIKey)).done(
                    function (response) {
                        console.log(response);
                        $("#recommendations").empty()
                        //var recommendations = $("<ul></ul>") //[];
                        for(let i=0; i<response.length; i++){
                            if(i>0){$("#recommendations").append("<div class='overline'></div>");}
                            var newOption =  $(`<div class="dropdown-item" id="${i}">`);
                            newOption.append(`${response[i].label}`)
                            $("#recommendations").append(newOption)
                        }
                        $("#recommendations").removeClass('hide') //.append(recommendations);
                        // user picks an option
                        $("#recommendations").on('click',function(event){
                            var opt = event.target.id;
                            var choice = document.getElementById(opt).innerHTML //$(document).find(`div#${opt}`).val()
                            console.log(opt, choice)
                            // iteratively check placeOptions for non-empty fields to assign
                            for (let i=0; i<placeOptions.length; i++){
                                if (response[opt][placeOptions[i]]!=""){
                                    userCityChoice = response[opt].name;
                                    break;
                                }
                                else{continue}
                            }
                            currentDestinationID = response[opt].dest_id;
                            latituide = response[opt].latituide
                            longitude = response[opt].longitude
                            $("#enter-location").val(choice);
                            // clear recommendations
                            $("#recommendations").attr('class','hide')
                            $("#recommendations").empty();
                        })
                    });
            }
            // clear recommendedation field if user goes below 3 letters
            else{
                $("#recommendations").attr('class','hide')
                $("#recommendations").empty();}
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
        submitManualSearch.on("click", function(){
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
            var url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${userFromDate}&departure_date=${userToDate}&guest_qty=${currentNumAdults}&dest_ids=${currentDestinationID}&room_qty=${currentNumRooms}&search_type=city&children_qty=2&children_age=5%2C7&search_id=none&price_filter_currencycode=USD&order_by=${orderCriteria}&languagecode=en-us&travel_purpose=leisure`
            //var url = `https://booking-com.p.rapidapi.com/v2/hotels/search?locale=en-gb&dest_id=${currentDestinationID}&checkout_date=${userToDate}&adults_number=${currentNumAdults}&dest_type=city&checkin_date=${userFromDate}&room_number=${currentNumRooms}&units=metric&order_by=${orderCriteria}&filter_by_currency=AED&children_number=0&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1&children_ages=5%2C0&page_number=0&include_adjacency=true` //`https://booking-com.p.rapidapi.com/v1/hotels/search?checkout_date=${userToDate}&adults_number=${currentNumAdults}&room_number=${currentNumRooms}&locale=en-gb&order_by=${orderCriteria}&units=metric&dest_type=${userCityChoice}&dest_id=${currentDestinationID}&filter_by_currency=GBP&checkin_date=${userFromDate}&children_ages=5%2C0&children_number=0&page_number=0&include_adjacency=true&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1`
            // initiate search sequence!!!
            console.log(url,bookingDotComAPIKey)
            $.ajax(callApiDojoBooking(url,bookingDotComAPIKey)).done(
                function (response) {
                    console.log(response);
                })
        })

        }
    )
