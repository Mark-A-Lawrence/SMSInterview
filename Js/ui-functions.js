$(document).ready(function(){
    $(".switchbtn").click(function(){
        $(".switchbtn").removeClass("active-switch");
      $(this).addClass("active-switch");
      if($(this).attr("id")=="acsending"){

        var selectedval = $('.homeworld').val();
        sort(selectedval,1);

      }else  if($(this).attr("id")=="desending"){

        var selectedval = $('.homeworld').val();
        sort(selectedval,2);

      }
    });
    
  });
  