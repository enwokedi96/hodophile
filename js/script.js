$(document).ready(
    function(){
        var manualAuto = $('#manual-automatic'); // container for manual and automatic
        var manual = $('#manual'); // manual button
        var manualSearch = $('#services-manual');
        var closeManual = $("#close");
        
        // add click event for manual search
        manual.on('click', function(){
            manualAuto.attr('class','hide')
            manualSearch.removeClass('hide')
        })

        // add click event for manual search
        closeManual.on('click', function(){
            manualSearch.attr('class','hide')
            manualAuto.removeClass('hide')
        })
    }
)