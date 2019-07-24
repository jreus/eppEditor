/*
This file contains the code running within the js-window thread.
It contains a number of helped functions, as well as the
callback function 'onmessage' that allows the root js context to
communicate with the js-window thread. (index.js)


*/

"use strict";
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("http://mlweb.loria.fr/lalolib.js");
import "./magenta/magentamusic.js";


// let a = tf.tensor([100]);
var geval = eval; // puts eval into global scope https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

// The following eval statements run code in the js-window thread

// initialize a default input and output function
geval("var input = (id,x) => {}");
geval("var output = (x) => {return 0;}");

// load custom helper functions.
// these will use postMessage to communicate with the main javascript GUI thread of the browser.
// Each function must have a corresponding responder in index.js
geval(`
var loadResponders = {};
var sema = {
  saveF32Array: (name, val) => {
    postMessage({
      "func": "save",
      "name": name,
      "val": val
    });
    return 0;
  },
  loadF32Array: (name, onload) => {
    postMessage({
      "func": "load",
      "name": name,
    });
    loadResponders[name] = onload;
    return 0;
  },
  download: (name) => {
    postMessage({
      "func": "download",
      "name": name,
    });
  },
  sendCode: (code) => {
    postMessage({
      "func": "sendcode",
      "code": code,
    });
  },
  setScale: (scale) => {
    postMessage({
      "func": "setscale",
      "scale": scale,
    });
  },
  setBackgroundColor: (red,green,blue) => {
    postMessage({
      "func": "setbackgroundcolor",
      "red": red,
      "green": green,
      "blue": blue,
    });
  },
};
`);



onmessage = (m) => {
  if ('eval' in m.data) {
    let evalRes = geval(m.data.eval);
    if (evalRes != "undefined")
      console.log(evalRes);
  }else if ('val' in m.data) {
//    console.log("val");
    let val = m.data.val;
   // console.log(val);
    val = JSON.parse(`[${val}]`)
//    console.log(val);
    // console.log(loadResponders);
    loadResponders[m.data.name](val);
    delete loadResponders[m.data.name];
  }else {
//     console.log(m.data.rq);
    if (m.data.rq=="send") {
      input(m.data.id, m.data.value);
    }else{
      //receive request
      postMessage({
        func:"data",
        worker: 'testmodel',
        val: output(m.data.value),
        tname: m.data.tname
      });
    }
  }
};
