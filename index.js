const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let text = ""

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

execute("xsel", function(test){
  if (test) {
    try {
      const window = (new JSDOM(``, { runScripts: "outside-only" })).window;
      window.eval(test)
      text = window.document.querySelector("body").textContent;
    } catch (e) {
      if (!text) {
        try {
          text = eval(test)
        } catch (e){
      
        }
      }
    }
    console.log(text);
  }
})
