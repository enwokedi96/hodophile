$(document).ready(
    function () {
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close"); // close button
        const imageTag = $('#image')

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
                'url("/images/egypt.jpg")',
                'url("/images/egypt1.jpg")',
                'url("/images/italy2.jpg")',
                'url("/images/maldives1.jpg")',
                'url("/images/paris.jpg")',
                'url("/images/masai-mara-kenya.jpg")',
                'url("/images/peru.jpg")',
                'url("/images/statue-of-liberty-us.jpg")',


            ]

            const bg = images[Math.floor(Math.random() * images.length)];
            //console.log(bg)
            imageTag.css({
                "background-image": bg,
                "background-size": "cover"
            });
        }

        setInterval(changeImage, 3000)
    }
)