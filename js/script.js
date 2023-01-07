$(document).ready(
    function(){
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close"); // close button

        // add click event for manual search
        manual.on('click', function(){
            manualAuto.addClass('hide')
            manualSearch.removeClass('hide')
        })

        // add click event for manual search
        closeManual.on('click', function(){
            manualSearch.addClass('hide')
            manualAuto.removeClass('hide')
        })
    }
)