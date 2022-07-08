const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const esquery = require('esquery').default;

const sourceNode = document.getElementById('source');
const selectorNode = document.getElementById('selector');
const selectorAstNode = document.getElementById('selectorAst');
const outputNode = document.getElementById('output');
const outputCode = document.getElementById('outputCode');

function update() {
  const ast = parse(sourceNode.value, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript",
    ],
  });
  sourceTree.textContent = JSON.stringify(ast, null, '    ');

  const selector = selectorNode.value;
  selectorAstNode.innerHTML = '';
  outputNode.innerHTML = '';
  outputCode.innerHTML = '';

  let start, end, selectorAst, selectorAstOutput, matches = [], matchesOutput;

  try {
    start = performance.now();
  } catch (e) {
    start = Date.now();
  }

  try {
    selectorAst = esquery.parse(selector);
  } catch (e) {
    selectorAstOutput = e.message;
  }

  try {
    matches = esquery.match(ast, selectorAst);
  } catch (e) {
    matchesOutput = e.message;
  }

  try {
    end = performance.now();
  } catch (e) {
    end = Date.now();
  }

  selectorAstOutput = selectorAstOutput || JSON.stringify(selectorAst, null, '  ');
  matchesOutput = matchesOutput || JSON.stringify(matches, null, '  ');

  selectorAstNode.appendChild(document.createTextNode(selectorAstOutput));
  outputNode.appendChild(document.createTextNode((matches ? matches.length : 0) + ' nodes found in ' + (end - start) + 'ms\n' + matchesOutput));
  matches.forEach((match) => {
    outputCode.appendChild(document.createTextNode(generate(match).code));
    outputCode.appendChild(document.createTextNode('\n\n/**/\n\n'));
  });
}

update();

sourceNode.addEventListener('change', update);
selectorNode.addEventListener('change', update);
selectorNode.addEventListener('keyup', update);
outputNode.addEventListener('change', update);