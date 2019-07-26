'amsynth': {
    "setup":(o,p) => `${o} = new Module.maxiOsc();
        ${o}mod = new Module.maxiOsc();
        ${o}.phaseReset(${p.length>2 ? p[1].loop : 0.0});
        ${o}mod.phaseReset(${p.length>2 ? p[1].loop : 0.0});`,
    "loop":(o,p) => `${o}.sinewave(${p[0].loop})*${o}mod.sinewave(${p[1].loop})`},
  'fmsynth': {
    "setup":(o,p) => `${o} = new Module.maxiOsc();
      ${o}mod = new Module.maxiOsc();
      ${o}.phaseReset(${p.length>3 ? p[1].loop : 0.0});
      ${o}mod.phaseReset(${p.length>3 ? p[1].loop : 0.0});`,
    "loop":(o,p) => `${o}.sinewave(${p[0].loop} + ${o}mod.sinewave(${p[0].loop} * ${p[1].loop}) * (${p[2].loop} * ${p[0].loop} * ${p[1].loop}))`},  
  'oscbank': {
    "setup":(o,p) => 
    `${o} = [];
    for (let i=0; i<${p.length}; i++){
      ${o}[i] = new Module.maxiOsc(); }`,
    "loop":(o,p) => {let s=`(${o}[0].sinewave(${p[0].loop})`; for(let i=1; i < p.length; i++) s += `+${o}[${i}].sinewave(${p[i].loop})`; return s+")";}},