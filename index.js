const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let text = ""

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

execute("xsel -o | cat", function(test){
  if (test) {
    testToEval = test.replace( /alert\(/g ,"console.log(")
    if (test.indexOf("</script>") === -1 || test.indexOf("</body>") === -1) {
      try {
        const window = (new JSDOM(``, { runScripts: "outside-only" })).window;
        window.eval(testToEval)
        text = window.document.querySelector("body").textContent;
      } catch (e) {
        console.error(e) 
        if (!text) {
          try {
            text = eval(testToEval)
          } catch (e){
            console.error(e) 
          }
        }
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
        if (!text) {
          try {
            text = eval(testToEval)
          } catch (e){
            console.error(e) 
          }
        }
      }
    }
    if (text) {
      execute("espeak -ven-us+f4 -s170 \"" + text + "\"", () => {})
     // console.log(text);
    } else {
      console.log(test);
    }
  }
})
