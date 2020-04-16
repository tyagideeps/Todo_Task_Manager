$(function() {
    $("#table tr.notes").hide()
    $("table").click(function(event) {
        event.stopPropagation()
        var $target = $(event.target.closest("tr"))
        if ( $target.next().attr('class') ==  'notes') {
            $target.next().slideToggle()
        }                    
    })
})