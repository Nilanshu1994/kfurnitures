var CLOUDINARY_URL= "https://api.cloudinary.com/v1_1/nilanshu30/upload";
var CLOUDINARY_UPLOAD_PRESET="cmpujmae";

var imgpreview = document.getElementById("img-preview");
var fileupload = document.getElementById("file-upload");
var fake = document.getElementById("abc");


fileupload.addEventListener("change", function(event){
    var file=event.target.files[0];
	var formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);



 axios({
 	url: CLOUDINARY_URL,
 	method: "POST",
 	headers: {
 		"Content-Type" : "application/x-www-form-urlencoded"
 	},
 	data: formData
 }).then(function(res) {
 	console.log(res);
 	imgpreview.src= res.data.secure_url;
 	fake.value= res.data.secure_url;
 }).catch(function(err) {
 	console.log(err);
 });
 });