
const API_URL = "http://192.168.1.134:3000";


// queries the database for the table content
function switch_classlist(i){

    // insert new element (empty) into DOM
    $("#main_content").html('<div id="classlist_table">');
    
    // query the db
    $.get( API_URL+"/classlist/"+i, function( data ) {
        var table = new Tabulator("#classlist_table", {
            data:data,
            layout:"fitColumns",
            responsiveLayout:"hide",
            columns:[                 
                    {title:"Student Name", field:"student_name"},
                    {title:"Section", field:"section_name"},
                ],
        });
    });
}

// waits for DOM (page) to complete loading
$(function() {


    // loads subjects into the dropdown
    $.get( API_URL+"/subjects", function( data ) {
        let subject_list = "";

        data.forEach(function(item,index){
            subject_list += '<li><a id="'+item.id+'" onclick="switch_classlist('+item.id+')" class="dropdown-item" href="#" value="'+index+'">'+item.name+'</a></li>'
        });

        $(".dropdown-menu").html(subject_list);
    });

    // event binding
    $("#all_students").click(function(){
        $("#main_content").html('<div id="students_table">');
        $.get( API_URL+"/all_students_w_section", function( data ) {
            var table = new Tabulator("#students_table", {
                data:data,
                layout:"fitColumns",
                responsiveLayout:"hide",
                columns:[                 
                    {title:"Student Name", field:"student_name"},
                    {title:"Section", field:"section_name"},
                ],
            });
        });
    });

    // self trigger instead of duplicating code
    $("#all_students").click();

});