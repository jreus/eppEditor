
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  separator:    /,/,
  paramEnd:     /\)/,
  paramBegin:   /\(/,
  opadd:        /\+/,
  opmult:        /\*/,
  opmin:        /\-/,
  opdiv:        /\//,
  variable:     /\?[a-zA-Z0-9]+/,
  samplename:   { match: /[:][a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  stretch:      { match: /[@][a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  semicolon:    /;/,
  equals:       /=/,
  funcName:     /[a-zA-Z][a-zA-Z0-9]*/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

main -> _ Statement _                                         {% d => ({ "@lang" : d[1] })  %}

Statement ->
      Expression _ %semicolon _ Statement            {% d => [{ "@spawn": d[0] }].concat(d[4]) %}
      |
      Expression                                      {% d => [{"@sigOut": { "@spawn": d[0] }}] %}
      # | %hash . "\n"                                          {% d => ({ "@comment": d[3] }) %}

Expression ->
  %funcName ParameterList
  {% d=> semaIR.synth(d[0].value, d[1]["@params"])%}
  |
  %samplename _ ParameterList
  {% d => semaIR.synth("sampler", d[2]["@params"].concat([semaIR.str(d[0].value)]))%}
  |
  %stretch ParameterList
  {% d => semaIR.synth("stretch", d[1]["@params"].concat([semaIR.str(d[0].value)]))%}
  |
  %variable __ %equals __ Expression
  {% d => semaIR.setvar(d[0],d[4]) %}
  |
  opArg _ BinOp _ opArg
  {% d => {
    return semaIR.synth(d[2], [ d[0], d[4] ]);
  } %}

opArg ->
  %number     {% (d) => ({"@num":d[0]}) %}
  |
  Expression  {% id %}
  |
  %variable   {% (d) => semaIR.getvar(d[0]) %}

ParameterList ->
  %paramBegin Params  %paramEnd
  {% d => ({"paramBegin":d[0], "@params":d[1], "paramEnd":d[2]} ) %}

Params ->
  ParamElement                                                   {% (d) => ([d[0]]) %}
  |
  ParamElement _ %separator _ Params                             {% d => [d[0]].concat(d[4]) %}

ParamElement ->
  %number                                                     {% (d) => ({"@num":d[0]}) %}
  |
  Expression                                                  {% id %}
  |
  %variable                                                   {% (d) => semaIR.getvar(d[0]) %}
  |
  %paramBegin Params  %paramEnd                               {%(d) => ({"@list":d[1]})%}

BinOp ->
    %opmult   {% (d) => "mul" %}
    |
    %opadd   {% (d) => "add" %}
    |
    %opmin    {% (d) => "sub" %}
    |
    %opdiv    {% (d) => "div" %}



# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}
