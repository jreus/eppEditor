
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  separator:    /,/,
  paramEnd:     />/,
  paramBegin:   /</,
  variable:     /[_][a-zA-Z0-9]+/,
  sample:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  stretch:       { match: /\@[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //oscAddress:   /(?:\/[a-zA-Z0-9]+)+/,
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  semicolon:    /;/,
  funcName:     /[a-zA-Z][a-zA-Z0-9]*/,
  comment:      /#[A-Za-z0-9 \.\/\\\+\-\_\!\?\:\)\(]+#/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

main -> Comment:? _ Statement _                                         {% d => ({ "@lang" : d[2] })  %}

Comment -> %comment   {% (d) = null %}

Statement ->
      Expression _ %semicolon _ Statement            {% d => [{ "@spawn": d[0] }].concat(d[4]) %}
      |
      Expression                                      {% d => [{"@sigOut": { "@spawn": d[0] }}] %}
      # | %hash . "\n"                                          {% d => ({ "@comment": d[3] }) %}
      |
      Expression _ %semicolon


Expression ->
  %funcName ParameterList
  {% d=> semaIR.synth(d[0].value, d[1]["@params"])%}
  |
  ParameterList _ %sample
  {% d => semaIR.synth("sampler", d[0]["@params"].concat([semaIR.str(d[2].value)]))%}
  |
  ParameterList _ %stretch
  {% d => semaIR.synth("stretch", d[0]["@params"].concat([semaIR.str(d[2].value)]))%}
  |
  %variable _ VariableAssignment
  {% d => semaIR.setvar(d[0],d[2]) %}

VariableAssignment ->
  Expression | %number

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




# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}
