$(document).ready(
    function () {
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close"); // close button
        const imageTag = $('#image') // tag attached to body
        var currentNumRooms = $("#rooms").val();
        var currentNumAdults = $("#rooms").val();

        // add click event for manual search
        manual.on('click', function () {
            manualAuto.addClass('hide')
            manualSearch.removeClass('hide')
        })

        // add click event for manual search
        closeManual.on('click', function () {
            manualSearch.addClass('hide')
            manualAuto.removeClass('hide')
        })

        // image transitions in the background
        function changeImage() {
            const images = [
                'url("./images/egypt.jpg")',
                'url("./images/egypt1.jpg")',
                'url("./images/italy2.jpg")',
                'url("./images/kenya.jpg")',
                'url("./images/maldives1.jpg")',
                'url("./images/paris.jpg")',
            ]

            const bg = images[Math.floor(Math.random() * images.length)];
            console.log(bg)
            imageTag.css({
                "background-image": bg,
                "background-size": "cover"
            });
        }
        
        // sift randomly through images every 3 seconds
        setInterval(changeImage, 3000);

        // set increment and decrement factor for rooms and adults fields
        function changeCount(id){
            // increase count
            if (id.includes('increase')){
                $(`#${id}`).on("click", function(){
                    currentNumRooms = parseInt(currentNumRooms) + 1;
                    $("#rooms").val(`${currentNumRooms}`);
                })}
            // decrease count
            if (id.includes('decrease')){
                $(`#${id}`).on("click", function(){        
                    if (parseInt(currentNumRooms)>1){
                        currentNumRooms = parseInt(currentNumRooms) - 1;
                        $("#rooms").val(`${currentNumRooms}`);}
                    else(console.log("Boi, you can't book lower than a room!!"))
                    }
                )
            }
        }
    }
)