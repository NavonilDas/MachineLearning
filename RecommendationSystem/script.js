/// Generate a number between 0 - 255
function RandomColor() {
    return Math.round(255 * Math.random());
}
/// Generate a div of random color
function generateColorDiv(r, g, b) {
    const div = document.createElement('div');
    div.style = "background:rgb(" + r + "," + g + "," + b + ")";
    div.setAttribute("R", r);
    div.setAttribute("G", g);
    div.setAttribute("B", b);
    return div.outerHTML;
}
var contents, data = [], stars, model = null;

function Load() {
    /// Load Save data from localStorage
    var x = window.localStorage.getItem('Data');
    if (x)
        data = JSON.parse(x);

    contents = document.getElementById('contents');
    stars = document.getElementById('RatingBar').getElementsByTagName('i');

    LoadColorPicker();

    for (let i = 0; i < stars.length; ++i) {
        stars[i].addEventListener('mouseover', Hover);
        stars[i].addEventListener('mouseout', HoverOut);
        stars[i].addEventListener('click', setRating);
    }
    GenerateModel();
    if (data.length > 0)
        Train(data);
    Recommend();
}

/// Function colors the rating bar on hovering over it
function Hover() {
    const i = this.getAttribute("val");
    if (i != -1)
        for (let x = i - 1; x >= 0; --x)
            stars[x].classList.add("goldc");
}

/// Function change color back to original on hovering out
function HoverOut() {
    const i = this.getAttribute("val");
    if (i != -1)
        for (let x = i - 1; x >= 0; --x)
            if (stars[x].getAttribute('val') != -1)
                stars[x].classList.remove("goldc");
}

// Function to generate a feed forward Neural Network
function GenerateModel() {
    // 15 Input Nodes , 10 Nodes in hidden layer , 1 output
    model = new brain.NeuralNetwork({
        learningRate: 0.1,
        hiddenLayers: [10],
        activation: 'sigmoid',
    });
}

function setRating() {
    const i = this.getAttribute("val");
    if (i == -1) return;
    const mains = document.getElementById('pallete-main').getElementsByTagName('div');
    var inps = [];
    for (var x = 0; x < mains.length; ++x) {
        const main = mains[x];
        const r = main.getAttribute('r'), g = main.getAttribute('g'), b = main.getAttribute('b');
        inps.push(parseFloat(r) / 255.0);
        inps.push(parseFloat(g) / 255.0);
        inps.push(parseFloat(b) / 255.0);
    }
    data.push({ x: inps, y: i / 5.0 });
    for (let x = i - 1; x >= 0; --x) {
        stars[x].setAttribute('val', "-1");
        stars[x].classList.add("goldc");
    }
    window.localStorage.setItem("Data", JSON.stringify(data));
    Train();
    Recommend();
}
function clearRating() {
    const mains = document.getElementById('pallete-main').getElementsByTagName('div');
    for (var x = 0; x < mains.length; ++x) {
        stars[x].setAttribute('val', (x + 1));
        stars[x].classList.remove("goldc");
    }
}
function Train(val) {
    if (val instanceof Array) {
        let tmp = [];
        for (var i = 0; i < val.length; ++i) {
            tmp.push({
                input: val[i].x,
                output: [val[i].y]
            });
        }
        model.train(tmp);
    } else {
        const d = data[data.length - 1];
        model.train([{ input: d.x, output: [d.y] }]);
    }
}

function Recommend(picked) {
    var all = [];
    if (picked instanceof Array) {
        var noma = picked.map((val)=>val/255);
        
        for (var i = 0; i < 2000; ++i) {
            var inp = noma.slice(), col = picked.slice();
            
            for (var j = 0; j < 15 - picked.length; ++j) {
                var t = RandomColor();
                inp.push(t / 255.0);
                col.push(t);
            }
            var o = model.run(inp);
            all.push({ inp: col, o: o });
        }
    } else
        for (var i = 0; i < 2000; ++i) {
            var inp = [], col = [];

            for (var j = 0; j < 15; ++j) {
                var t = RandomColor();
                inp.push(t / 255.0);
                col.push(t);
            }

            var o = model.run(inp);
            all.push({ inp: col, o: o });
        }

    all.sort(function (a, b) {
        return a.o - b.o;
    });
    var x = all[0], tmp = "", xxx = "";

    for (var i = 0; i < 15; i += 3)
        tmp += generateColorDiv(x.inp[i], x.inp[i + 1], x.inp[i + 2]);

    document.getElementById('pallete-main').innerHTML = tmp;
    contents.innerHTML = "";

    for (var i = 1; i < 29; i++) {
        tmp = "";
        for (var j = 0; j < 15; j += 3)
            tmp += generateColorDiv(all[i].inp[j], all[i].inp[j + 1], all[i].inp[j + 2]);
        xxx = '<div class="card" onclick="openColor(this)">' + tmp + '</div>';
        contents.innerHTML += xxx;
    }
    clearRating();
}

function openColor(e) {
    document.getElementById('pallete-main').innerHTML = e.innerHTML;
}

// Function Dowload data as json for further usage
function download() {
    const val = JSON.stringify(data);
    var file = new Blob([val], { type: 'text/json' });
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = "Data.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}