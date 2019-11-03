const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let text = ""

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

var gg = `
var getGlobles = function (ks) {
  var newKs = []
  if (globalThis) {
    Object.keys(globalThis).forEach(function(key) {
      if(ks.indexOf(key) == -1 && key !== "getGlobles") {
        newKs.push({
          key:key, 
          value: globalThis[key]
        });
      }
    }.bind(this))
  }
  return newKs.map(k => {
    return k.key + " is " + k.value 
  }).join("\\n and ")
}
getGlobles(globalThis.ks)
        `

execute("xsel -o | cat", function(test){
  if (test) {
    let testToEval = test.replace( /alert\(/g ,"console.log(")
    globalThis.ks = Object.keys(globalThis)
    globalThis.ks.push("ks")
    try {
      text = eval(testToEval)
      if (!text) {
        text = globalThis.eval(testToEval + gg)
      }
    } catch (e) {
      console.error(e) 
      if (test.indexOf("</script>") === -1 || test.indexOf("</body>") === -1) {
        try {
          const window = (new JSDOM(``, { runScripts: "outside-only" })).window;
          window.eval(testToEval)
          text = window.document.querySelector("body").textContent;
        } catch (e) {
          console.error(e) 
        }
      } else {
        try {
          const window = (new JSDOM(testToEval, { runScripts: "dangerously" })).window;
          var scripts = [... window.document.querySelectorAll("script")];
	  scripts.forEach(elem => {
            elem.parentNode.removeChild(elem);
          })
          text = window.document.querySelector("body").textContent;
          
        } catch (e) {
          console.error(e) 
        }
      }
    }
    if (text) {
      execute("espeak -ven-us+f4 -s170 \"" + text + "\"", () => {})
      // console.log("" + text);
    } else {
      console.log(test);
    }
  }
})
