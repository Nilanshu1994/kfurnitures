
$(document).ready(function(){
var addcart = document.getElementById("addtocart");

addcart.addEventListener("click",function(event){
	var xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/addcart", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("fid="+addcart.name);
});

});