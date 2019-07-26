/*

This file contains the mappings between epp signal processing commands
and javascript commands in the Maximilian library.

jsFuncMap contains mappings between each command and its corresponding javascript.

When the language tree is parsed and decoded into signal processing instructions
in the audio worklet, it is done in two steps:
>> 1 >> setup, where all the necessary objects/signal generators are initialized
and
>> 2 >> loop, where the dsp itself happens

This process happens in maxi-processor.js

You can modify jsFuncMap to include your own custom commands and
corresponding javascript code (as function returning a string of valid javascript)
to be included in the setup and loop sections of the Audio Worklet.
*/

var objectID = 0;

const oscMap = {
  '@sin': "sinewave",
  "@saw": "saw",
  "@square": "square",
  "@tri": "triangle",
  "@pha": "phasor"
};

/*
Check out Timo's ugens

https://github.com/tmhglnd/eppEditor/blob/master/doc/semaIR.md
*/

const jsFuncMap = {
'saw': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.saw(${p[0].loop})`},
'sin': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.sinewave(${p[0].loop})`},
'tri': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.triangle(${p[0].loop})`},
'pha': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.phasor(${p[0].loop})`},
'ph2': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>3 ? p[3].loop : 0.0});`, "loop":(o,p)=>`${o}.phasor(${p[0].loop},${p[1].loop},${p[2].loop})`},
'sqr': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.square(${p[0].loop})`},
'pul': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});`, "loop":(o,p)=>`${o}.pulse(${p[0].loop},${p[1].loop})`},
'imp': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.impulse(${p[0].loop})`},
'sawn': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.sawn(${p[0].loop})`},
'noiz': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.noise()*${p[0].loop}`},
'gt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} > ${p[1].loop}) ? 1 : 0`},
'lt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} < ${p[1].loop}) ? 1 : 0`},
'mod': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} % ${p[1].loop})`},
'add': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.add(${p[0].loop},${p[1].loop})`},
'mul': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.mul(${p[0].loop},${p[1].loop})`},
'sub': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.sub(${p[0].loop},${p[1].loop})`},
'div': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.div(${p[0].loop},${p[1].loop})`},
'pow': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.pow(${p[0].loop},${p[1].loop})`},
'abs': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMath.abs(${p[0].loop})`},
'env': {"setup":(o,p)=>`${o} = new Module.maxiEnv();${o}.setAttack(${p[1].loop});${o}.setDecay(${p[2].loop});${o}.setSustain(${p[3].loop});${o}.setRelease(${p[4].loop})`, "loop":(o,p)=>`${o}.adsr(1,${p[0].loop})`},
'sum': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+")";}},
'mix': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`((${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+`)/${p.length})`;}},
'prod': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `*${p[i].loop}`; return s+")";}},
'blin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
'ulin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, 0, 1, ${p[1].loop}, ${p[2].loop})`},
'bexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
'uexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, 0.0000001, 1, ${p[1].loop}, ${p[2].loop})`},
'linlin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`},
'linexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`},
'dist': {"setup":(o,p)=>`${o} = new Module.maxiDistortion()`, "loop":(o,p)=>`${o}.atanDist(${p[0].loop},${p[1].loop})`},
'flange': {"setup":(o,p)=>`${o} = new Module.maxiFlanger()`, "loop":(o,p)=>`${o}.flange(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
'chor': {"setup":(o,p)=>`${o} = new Module.maxiChorus()`, "loop":(o,p)=>`${o}.chorus(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
'dl': {"setup":(o,p)=>`${o} = new Module.maxiDelayline()`, "loop":(o,p)=>`${o}.dl(${p[0].loop},${p[1].loop},${p[2].loop})`},
'lpf': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lopass(${p[0].loop},${p[1].loop})`},
'hpf': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hipass(${p[0].loop},${p[1].loop})`},
'lpz': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lores(${p[0].loop},${p[1].loop},${p[2].loop})`},
'hpz': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hires(${p[0].loop},${p[1].loop},${p[2].loop})`},
'toJS': {"setup":(o,p)=>`${o} = this.registerTransducer('${o}', ${p[0].loop})`, "loop":(o,p)=>`${o}.send(${p[1].loop}, ${p[2].loop})`},
'fromJS': {"setup":(o,p)=>`${o} = this.registerTransducer('${o}', ${p[0].loop})`, "loop":(o,p)=>`${o}.receive(${p[1].loop})`},
'adc': {"setup":(o,p)=>"", "loop":(o,p)=>`inputs`},
'sampler': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                            ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
            "loop":(o,p)=>`(${o}.isReady() ? ${o}.playOnZX(${p[0].loop}) : 0.0)`},
            'loop': {"setup":(o,p)=>`${o} = new Module.maxiSample();
            ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
            "loop":(o,p)=>`(${o}.isReady() ? ${o}.play(${p[0].loop}) : 0.0)`},
'oscin':{"setup":(o,p)=>"", "loop":(o,p)=>`this.OSCTransducer(${p[0].loop},${p[1].loop})`},
'oscout':{"setup":(o,p)=>"", "loop":(o,p)=>`this.OSCTransducer(${p[0].loop},${p[1].loop})`},

'sah':{"setup":(o,p)=>`${o} = new Module.maxiSampleAndHold();`, "loop":(o,p)=>`${o}.sah(${p[0].loop},${p[1].loop})`},

'stretch': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                              ${o}.setSample(this.getSampleBuffer(${p[4].loop}));
                              ${o}stretch = new Module.maxiStretch();
                              ${o}stretch.setSample(${o});
                              `,
            "loop":(o,p)=>`(${o}.isReady() ? ${o}stretch.play(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},0.0) : 0.0)`},
                                  // "loop":(o,p)=>`(0.0)`},
                                  // "loop":(o,p)=>`(${o}.isReady() ? 0.0 : 0.0)`},
'am': {"setup":(o,p) => `${o} = new Module.maxiOsc();
                                ${o}mod = new Module.maxiOsc();
                                ${o}.phaseReset(${p.length>2 ? p[1].loop : 0.0});
                                ${o}mod.phaseReset(${p.length>2 ? p[1].loop : 0.0});`,
      "loop":(o,p) => `${o}.sinewave(${p[0].loop})*${o}mod.sinewave(${p[1].loop})`},
'fm': {"setup":(o,p) => `${o} = new Module.maxiOsc(); ${o}mod = new Module.maxiOsc();
                                ${o}.phaseReset(${p.length>3 ? p[1].loop : 0.0}); ${o}mod.phaseReset(${p.length>3 ? p[1].loop : 0.0});`,
      "loop":(o,p) => `${o}.sinewave(${p[0].loop} + ${o}mod.sinewave(${p[0].loop} * ${p[1].loop}) * (${p[2].loop} * ${p[0].loop} * ${p[1].loop}))`},
'oscb': {"setup":(o,p) => `${o} = []; for (let i=0; i<${p.length}; i++){ ${o}[i] = new Module.maxiOsc(); }`,
          "loop":(o,p) => {let s=`(${o}[0].sinewave(${p[0].loop})`; for(let i=1; i < p.length; i++) s += `+${o}[${i}].sinewave(${p[i].loop})`; return s+")";}},
'sawb': {"setup":(o,p) => `${o} = []; for (let i=0; i<${p.length}; i++){ ${o}[i] = new Module.maxiOsc(); }`,
           "loop":(o,p) => {let s=`(${o}[0].sinewave(${p[0].loop})`; for(let i=1; i < p.length; i++) s += `+${o}[${i}].sinewave(${p[i].loop})`; return s+")";}},
// ring modulator
'rmod': {
      "setup":(o,p) => `${o} = new Module.maxiOsc();
                     ${o}mod = new Module.maxiOsc();
                     ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});
                     ${o}mod.phaseReset(${p.length>2 ? p[2].loop : 0.0});`,
                 "loop":(o,p) => `${o}.sinewave(${p[0].loop})*${o}mod.sinewave(${p[0].loop}*${p[1].loop})`},

'toFreq' : {"setup":(o,p)=>"", "loop":(o,p)=>`Math.pow(2, Math.floor(${p[0].loop}-69)/12) * 440`},
'const': {"setup":(o,p)=>"", "loop":(o,p)=>`${p[0].loop}`},

// delay line that self-mixes using ms times delay(signal, delay time in ms, feedback, wet level)
'delay': {
  "setup":(o,p)=>`${o} = new Module.maxiDelayline();
                  ${o}wet = ${p.length>3 ? p[3].loop : 0.4}`,
  "loop":(o,p)=>`${p[0].loop} * (1 -${o}wet) + Math.tanh(${o}.dl(${p[0].loop},${p[1].loop}*44.1,${p[2].loop})) * ${o}wet`},

// bpm-driven impule generator click(bpm,division,offset)
'click': {
  "setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});`,
    "loop":(o,p)=>`${o}.impulse((${p[0].loop}/240)*${p[1].loop})`},

'count': {
  "setup":(o,p)=>`${o} = new Module.maxiOsc();
                  ${o}.phaseReset(${p.length>3 ? p[3].loop : 0.0});`,
  "loop":(o,p)=>`Math.floor(${o}.phasor(${p[0].loop}/240,${p[1].loop},${p[2].loop}))`},

}

/*
{base_freq, modulation_freq}am;
{base_freq, fm_ratio, fm_depth}fm;
{freq1, freq2, freq3, …., freqn}oscb;
*/

class IRToJavascript {


  static getNextID() {
    objectID = objectID > 9999 ? 0 : ++objectID;
    return objectID;
  }

  static emptyCode() {
    return {
      "setup": "",
      "loop": "",
      "paramMarkers": []
    };
  }

  static traverseTree(t, code, level, vars) {
    // console.log(`DEBUG:IR:traverseTree: level: ${level}`);
    // console.log(vars);
    let attribMap = {
      '@lang': (ccode, el) => {
        // console.log("lang")
        // console.log(el);
        // console.log(ccode)
        let statements = [];
        el.map((langEl) => {
          let statementCode = IRToJavascript.traverseTree(langEl, IRToJavascript.emptyCode(), level, vars);
          console.log("@lang: " + statementCode.loop);
          ccode.setup += statementCode.setup;
          ccode.loop += statementCode.loop;
          // ccode.paramMarkers
        });
        return ccode;
      },
      '@sigOut': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        ccode.loop = `q.sigOut = ${ccode.loop};`;
        return ccode;
      },
      '@spawn': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        ccode.loop += ";";
        return ccode;
      },
      '@sigp': (ccode, el) => {
        let paramMarkers = [{"s":el['paramBegin'], "e":el['paramEnd'], "l":level}]
        ccode.paramMarkers = ccode.paramMarkers.concat(paramMarkers);

        let functionName = el['@func'].value;
        let funcInfo = jsFuncMap[functionName];
        let objName = "q.u" + IRToJavascript.getNextID();

        let allParams=[];

        for (let p = 0; p < el['@params'].length; p++) {
          let params = IRToJavascript.emptyCode();
          params = IRToJavascript.traverseTree(el['@params'][p], params, level+1, vars);
          // console.log(params);
          allParams[p] = params;
        }
        console.log(allParams);
        let setupCode = "";
        for (let param in allParams) {
          setupCode += allParams[param].setup;
          ccode.paramMarkers = ccode.paramMarkers.concat(allParams[param].paramMarkers);
        }
        ccode.setup += `${setupCode} ${funcInfo.setup(objName, allParams)};`;
        ccode.loop += `${funcInfo.loop(objName, allParams)}`;
        return ccode;
      },
      '@setvar': (ccode, el) => {
        // console.log("memset");
        // console.log(vars);
        let memIdx = vars[el['@varname']];
        if (memIdx == undefined) {
          memIdx = Object.keys(vars).length;
          vars[el['@varname']] = memIdx;
        }
        let varValueCode = IRToJavascript.traverseTree(el['@varvalue'], IRToJavascript.emptyCode(), level+1, vars);
        ccode.setup += varValueCode.setup;
        // ccode.loop = `this.setvar(q, '${el['@varname']}', ${varValueCode.loop})`;
        ccode.loop = `(mem[${memIdx}] = ${varValueCode.loop})`;
        return ccode;
      },
      '@getvar': (ccode, el) => {
        let memIdx = vars[el.value];
        if (memIdx == undefined) {
          memIdx = Object.keys(vars).length;
          vars[el.value] = memIdx;
        }
        // ccode.loop += `this.getvar(q, '${el.value}')`;
        ccode.loop += `mem[${memIdx}]`;
        return ccode;
      },
      '@string': (ccode, el) => {
        if (typeof el === 'string' || el instanceof String) {
          // console.log("String: " + el);
          ccode.loop += `'${el}'`;
        } else {
          ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        }
        return ccode;
      },
      '@num': (ccode, el) => {
        if (el.value) {
          ccode.loop += `${el.value}`;
        }
        //  else {
        //   ccode = IRToJavascript.traverseTree(el, ccode, level);
        // }
        return ccode;
      },
    }
    // console.log("Traverse")
    // console.log(t)
    if (Array.isArray(t)) {
      t.map((el) => {
        Object.keys(el).map((k) => {
          code = attribMap[k](code, el[k]);
        });
      })
    } else {
      Object.keys(t).map((k) => {
        // console.log(k);
        code = attribMap[k](code, t[k]);
      });
    }
    return code;
  }

  static treeToCode(tree) {
    // console.log(tree);
    let vars = {};
    let code = IRToJavascript.traverseTree(tree, IRToJavascript.emptyCode(), 0, vars);
    code.setup = `() => {let q=this.newq(); ${code.setup}; return q;}`;
    code.loop = `(q, inputs, mem) => {${code.loop} return q.sigOut;}`
    console.log(code.loop);
    // console.log(code.paramMarkers);
    return code;
  }

}

export default IRToJavascript;
