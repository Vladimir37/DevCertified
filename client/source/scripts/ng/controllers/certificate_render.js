export default function($scope) {
    var canvas_elem = document.getElementById("cert_canvas");
    var cert =  canvas_elem.getContext('2d');

    cert.fillStyle = "#E6E6E6";
    cert.fillRect(0, 0, canvas_elem.width, canvas_elem.height);

    var cert_template = new Image();
    cert_template.src = '/src/images/main/cert.png';
    cert_template.onload = function () {
        cert.fillStyle = "black";
        cert.font = '40px Arial';
        cert.textAlign = "center";
        cert.textBaseline = "bottom";
        cert.drawImage(cert_template, 0, 0, 960, 644);
        cert.fillText($scope.data.title, 480, 294);
        cert.fillText($scope.data.name, 480, 425);
        cert.fillText($scope.data.date, 735, 516);
    }
}
