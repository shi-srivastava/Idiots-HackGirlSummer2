function changeImg(imgNumber) 
{
    var myImages = ["CameraBG3.jpg", "CameraBG4.jpg", "CameraBG5.jpg", "CameraBG6.jpg", "CameraBG7.jpg", "CameraBG8.jpg", "CameraBG9.jpg", "CameraBG10.jpg", "CameraBG11.jpg", "CameraBG12.jpg", "CameraBG9.jpg", "CameraBG10.jpg"];
    var imgShown = document.body.style.backgroundImage;
    var newImgNumber = Math.floor(Math.random() * myImages.length);
    document.body.style.backgroundImage = 'url(' + myImages[newImgNumber] + ')';
}
window.onload = changeImg;