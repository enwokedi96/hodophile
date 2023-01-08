$(document).ready(
    function () {
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close"); // close button
        const imageTag = $('#image') // tag attached to body
        var currentNumRooms = $("#rooms").val();
        var currentNumAdults = $("#adults").val();
        var fromDate = $("#from-date") // input field for start date
        var toDate = $("#to-date") // input field for end date
        var todaysDate = moment().format("YYYY-MM-DD");
        
        // set both date fields to default to current day
        $('input[type="date"]').val(todaysDate) 
        $('input[type="date"]').attr('min',todaysDate) 

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

        // apply to adults event and field
        $("#increase-adults").on("click",function (event){
            // increase count
            var num = parseInt($("#adults").val());
            if (num>=29) {
                console.log("Boi, you can't book higher than number 29!!");
            }
            else {num += 1;}
            // update value
            $("#adults").val(`${num}`)
        })
        $("#decrease-adults").on("click",function (event){
            var num = parseInt($("#adults").val());
            // decrease count
            if (num==1) {
                console.log("Boi, you can't book lower than number one!!");}
            else {num -= 1;}
            // update value
            $("#adults").val(`${num}`)
        })

        // apply to rooms event and field
        $("#increase-rooms").on("click",function (event){
            // increase count
            var num = parseInt($("#rooms").val());
            if (num>=29) {
                console.log("Boi, you can't book higher than number 29!!");}
            else {num += 1;}
            // update value
            $("#rooms").val(`${num}`)
        })
        $("#decrease-rooms").on("click",function (event){
            var num = parseInt($("#rooms").val());
            // decrease count
            if (num==1) {
                console.log("Boi, you can't book lower than number one!!");
            }
            else {num -= 1;}
            // update value
            $("#rooms").val(`${num}`)
        })

        // api calls assist
        function callBookingDotCom(url, apiKey=bookingDotComAPIKey){
            return {"async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
            }}
        };

        // search for recommentations as user types
        $("#enter-location").on('keyup',function(event){
            event.preventDefault()
            console.log('user filling location');
            var loc = $("#enter-location").val();
            var url = `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${loc}&locale=en-gb`
            // when user input has reached 3 letters and greater, call on api to recommend
            if (loc.length>2){
                $.ajax(callBookingDotCom(url)).done(
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
                            userCityChoice = response[opt].city_name;
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

        $("#from-date").on("click",function(){
            console.log()
            console.log($("#from-date").val())
        })

        }
    )
