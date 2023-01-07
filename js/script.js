$(document).ready(
    function () {
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close"); // close button
        const imageTag = $('#image') // tag attached to body
        var currentNumRooms = $("#rooms").val();
        var currentNumAdults = $("#adults").val();

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

        }
    )
