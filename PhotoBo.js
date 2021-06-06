var context;
var width = 480; //Photo Size
var height = 270;



//receive the image from the Flash Player, if Flash is used.
function imageResult(data, videoWidth, videoHeight) 
{   
    var imageData = "data:image/png;base64," + data;
    var image = new Image;
    image.onload = function () 
    {
        /*-moz - transform: scaleX(-1);
        -o - transform: scaleX(-1);
        -webkit - transform: scaleX(-1);*/
        scaleX(-1);
        context.drawImage(this, 0, 0);
    };
    image.src = imageData;
    
}

document.addEventListener("DOMContentLoaded", init);

function init() {
    var isFlash = false;
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer, Inc/.test(navigator.vendor);

    var video = document.querySelector("#video");
    video.width = width;

    var canvas = document.getElementById("canvas");
    canvas.style.width = width + "px";
    canvas.width = width;

    context = canvas.getContext("2d");

    if ((isChrome || isSafari) && window.location.protocol == "http:") {
        document.getElementById("savedImages").innerHTML = "<h1>This browser only supports camera streams over https:</h1>";
    } else {
        startWebcam();
    }

    function startWebcam() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mediaDevices || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }, handleVideo, videoError).then(function (stream) {
                video.onloadedmetadata = setHeight;
                document.getElementById("buttonCapture").disabled = false;
                return video.srcObject = stream;
            })
                .catch(function (e) {
                    console.log(e.name + ": " + e.message);

                    document.getElementById("buttonCapture").disabled = true;

                    switch (e.name) {
                        case "NotAllowedError":
                            document.getElementById("savedImages").innerHTML = "<h3>You can't use this app because you denied camera access. Refresh the page and allow the camera to be used by this app.</h3>";
                            break;
                        case "NotReadableError":
                            document.getElementById("savedImages").innerHTML = "<h3>Camera not available. Your camera may be used by another application.</h3>";
                            break;
                        case "NotFoundError":
                            document.getElementById("savedImages").innerHTML = "<h3>Camera not available. Please connect a camera to your computer.</h3>";
                            break;
                    }
                });
        }
        else {
            canvas.style.height = height + "px";
            canvas.height = height;

            document.getElementById("buttonCapture").disabled = false;
            isFlash = true;
            video.style.display = "none";
            document.getElementById("fallback").style.display = "block";

            var script = document.createElement("script");
            document.getElementsByTagName("head")[0].appendChild(script);
            script.type = "text/javascript";
            script.onload = function () {
                var flashvars = {};

                var parameters = {};
                parameters.scale = "noscale";
                parameters.wmode = "transparent";
                parameters.allowFullScreen = "true";
                parameters.allowScriptAccess = "always";
                parameters.bgColor = "#999999";

                var attributes = {};
                attributes.name = "FlashWebcam";

                swfobject.embedSWF("fallback/webcam_fallback.swf", "fallback", width, height, "27", "expressInstall.swf", flashvars, parameters, attributes);
            }
            script.src = "fallback/swfobject.js";
        }

        function thisMovie(movieName) {
            if (navigator.appName.indexOf("Microsoft") != -1) {
                return window[movieName];
            } else {
                return document[movieName];
            }
        }

        function handleVideo(stream) {
            video.src = window.URL.createObjectURL(stream);
        }

        function videoError(e) {
            document.getElementById("savedImages").innerHTML = "<h3>" + e + "</h3>";
        }

        function setHeight() {
            var ratio = video.videoWidth / video.videoHeight;
            height = width / ratio;
            canvas.style.height = height + "px";
            canvas.height = height;
        }

        //add event listener and handle the capture button
        document.getElementById("buttonCapture").addEventListener("mousedown", handleButtonCaptureClick);

        function handleButtonCaptureClick() {
            console.log("style: " + document.getElementById("canvas").style.display)
            if (document.getElementById("canvas").style.display == "none" || document.getElementById("canvas").style.display == "") {
                document.getElementById("canvas").style.display = "block";
                document.getElementById("buttonCapture").innerHTML = "Retake";
                if (isFlash) {
                    thisMovie("FlashWebcam").capture();
                } else {
                    setHeight();
                    context.drawImage(video, 0, 0, width, height);
                }

                document.getElementById("buttonSave").innerHTML = "Save";
                document.getElementById("buttonSave").disabled = false;
            } else {
                makeCaptureButton();
            }
        }

        function makeCaptureButton() {
            document.getElementById("canvas").style.display = "none";
            document.getElementById("buttonCapture").innerHTML = "Capture";
            document.getElementById("buttonSave").innerHTML = "Save";
            document.getElementById("buttonSave").disabled = true;
        }

        //add event listener and handle the save button
        document.getElementById("buttonSave").addEventListener("mousedown", handleButtonSaveClick);

        function handleButtonSaveClick() {
            var dataURL = canvas.toDataURL("image/jpg");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "save.php"); //change this to .php or .asp, depending on your server
            xhr.onload = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var image = new Image();
                        image.src = "images/" + xhr.responseText;
                        document.getElementById("savedImages").insertAdjacentElement('afterbegin', image);
                        document.getElementById("buttonSave").innerHTML = "Saved";
                        document.getElementById("buttonSave").disabled = true;
                        makeCaptureButton();
                    }
                }
            };
            var form = new FormData();
            form.append("image", dataURL);
            xhr.send(form);
        }
    }
}
