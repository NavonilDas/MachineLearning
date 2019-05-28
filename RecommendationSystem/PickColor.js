var ctx;
var ref;
var toRet = [0, 0, 0, 0];
function LoadColorPicker() {
    const img = new Image();
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', PickColor);
    img.src = "wheel.png";
    img.onload = function () {
        canvas.width = img.width + 2;
        canvas.height = img.height + 2;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(canvas.width / 2, canvas.height / 2, img.width / 2 + 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.drawImage(img, 1, 1);
    }
    const el = document.querySelector('.Box .selector');
    el.appendChild(canvas);
}
function SelectColor() {
    document.getElementById('fullScreen').style = "display:flex";
    document.getElementById('allBlack').style = "display:block";
    toRet = [0, 0, 0, 0];
}

function PickColor(e) {
    const pickingData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    var clr = "#fff";
    if (pickingData.data[3] > 0)
        clr = "rgb(" + pickingData.data[0] + "," + pickingData.data[1] + "," + pickingData.data[2] + ");"
    if (ref) {
        ref.style = "background:" + clr;
        toRet[ref.getAttribute('index') - 1] = [
            pickingData.data[0],
            pickingData.data[1],
            pickingData.data[2],
        ];
    }
    ref = undefined;
}
function SelectPick(el) {
    el.style = "background:#fff";
    ref = el;
}

function CancelPick() {
    document.getElementById('fullScreen').style = "display:none";
    document.getElementById('allBlack').style = "display:none";
}

function Select() {
    var ret = [];
    for (var i = 0; i < 4; ++i) {
        if (toRet[i] instanceof Array)
            for (var j = 0; j < toRet[i].length; ++j)
                ret.push(toRet[i][j]);
    }
    CancelPick();
    Recommend(ret);
}