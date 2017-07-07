
$(document).ready(function(){
var addcart = document.getElementById("addtocart");
addcart.addEventListener("click",function(event){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
									if(xhttp.readyState == 4 && xhttp.status == 200){
								       if(xhttp.responseText === "success"){
                                            document.getElementById("succ").style.display="block"; 
								       }
								       else if(xhttp.responseText === "fail"){
                                             document.getElementById("err").style.display="block";
								       }
										}
									}

	xhttp.open("POST", "/addcart", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("fid="+addcart.name);
});

});