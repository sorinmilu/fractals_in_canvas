// Modificat dupa http://rembound.com/articles/drawing-mandelbrot-fractals-with-html5-canvas-and-javascript

//Algoritmul se numeste "escape time algorithm" si nu foloseste direct numere complexe, le simuleaza cu ajutorul numerelor reale

//mandelbrot este functia care este apelata de catre butonul din interfata. Aceasta primeste ca argumente
//pozitia din fractal al centrului imaginii (panx si pany) si factorul de marire (zoom).
//Functia cheama settext (care afiseaza mesajul de incepere a calculelor) iar apoi, dupa executia lui settext, functia mandel care deseneaza fractalul

function mandelbrot(panx, pany, zoom) {
    settext().then(value => {
            mandel(panx, pany, zoom);
        }
    ).then(value => {
        var statusdiv = document.getElementById("mstatus");
        statusdiv.innerText = 'Mandelbrot: pan x: ' + panx + ' pan y: ' + pany + ' zoom: ' + zoom;
    })
}

//settext este funcția care afiseaza mesajul de stare in pagina html. Aceasta returneaza o promisiune pentru a permite
//executia functiei mandel dupa aceasta.

function settext() {
    var statusdiv = document.getElementById("mstatus");
     statusdiv.innerText = 'Calculez ....';
       return new Promise(function(resolve, reject) {
        setTimeout(function() {
              resolve();
        },300);
  });
}

//mandel este functia principala care calculeaza fractalul. Aceasta creaza o structura
//de date care va contine imaginea, apoi porneste calculele.

function mandel(panx, pany, zoom) {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        var maxiterations = 150;

        var settings = {
            imagew : canvas.width,
            imageh : canvas.height,
            panx : panx,
            pany: pany,
            zoom: zoom,
            context : context,
            maxiterations: maxiterations
        };

        var imgdata = generateImage(settings);
        context.putImageData(imgdata, 0, 0);
    }


//genereaza o paleta de 256 de culori pentru punctele cu divergenta variabila
    function generatePalette() {
        var roffset = 24;
        var goffset = 16;
        var boffset = 0;
        var palette = new Array();
        for (var i=0; i<256; i++) {
            palette[i] = { r:roffset, g:goffset, b:boffset};

            if (i < 64) {
                roffset += 3;
            } else if (i<128) {
                goffset += 3;
            } else if (i<192) {
                boffset += 3;
            }
        }
        return palette;
    }

//genereaza imaginea fractalului calculand divergenta (sau convergenta) fiecauui pixel din canvas
//Pentru fiecare pixel apeleaza functia iterate care returneaza culoarea acestuia

    function generateImage(settings) {
        settings.palette = generatePalette();
        var imagedata = settings.context.createImageData(settings.imagew, settings.imageh);
        for (var y=0; y<settings.imageh; y++) {
            for (var x=0; x<settings.imagew; x++) {
                imgdata = iterate(x, y, settings);
                for (var pindex in imgdata) {
                    imagedata.data[pindex] = imgdata[pindex];
                }
            }
        }
        return imagedata;
    }


//aceasta functie se executa pentru fiecare pixel din canvas. Il converteste la coordonate tipice pentru
//spatiul Mandelbrot, tinand cont de pan si zoom, verifica convergenta acestuia si returneaza un obiect care
//contine 4 elemente: culorile (si transparenta) pixelului curent.
//obiectul ImageData stocheaza informatia grafica sub forma unui vector care copntine care o intrare pentru fiecare culoare
//a fiecarui pixel.

    function iterate(x, y, settings) {

        var offsetx = -settings.imagew/2;
        var offsety = -settings.imageh/2;

        var x0 = (x + offsetx + settings.panx) / settings.zoom;
        var y0 = (y + offsety + settings.pany) / settings.zoom;

        var a = 0;
        var b = 0;
        var rx = 0;
        var ry = 0;

        // Iteram pana cand ajungem la numarul maxim de iteratii sau pana cand
        //stim sigur ca seria curenta diverge (x*x + y*y > 4).
        var iterations = 0;
        while (iterations < settings.maxiterations && (rx * rx + ry * ry <= 4)) {
            rx = a * a - b * b + x0;
            ry = 2 * a * b + y0;

            a = rx;
            b = ry;
            iterations++;
        }

        // Daca numarul de iteratii este egal cu settings.maxiterations atunci inseamna ca punctul curent
        //este parte din setul Mandelbrot, il coloram cu negru.
        //Daca nu, alegem una dintre culorile din paleta in functie de gradul de divergenta (cat de multe iteratii
        // au fost necesare pentru a depasi punctul de divergenta, 4.
        var color;
        if (iterations == settings.maxiterations) {
            color = { r:0, g:0, b:0}; // Black
        } else {
            var index = Math.floor((iterations / (settings.maxiterations-1)) * 255);
            color = settings.palette[index];
        }

        var pixelindex = (y * settings.imagew + x) * 4;
        var imgdata = {};
        imgdata[pixelindex] = color.r;
        imgdata[pixelindex+1] = color.g;
        imgdata[pixelindex+2] = color.b;
        imgdata[pixelindex+3] = 255;
        return imgdata;
    }
