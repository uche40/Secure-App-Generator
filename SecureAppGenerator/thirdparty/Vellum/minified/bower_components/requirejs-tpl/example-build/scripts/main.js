define("text",{});define("underscore",{});define("tpl",{load:function(a){throw new Error("Dynamic load not allowed: "+a)}});define("tpl!templates/message",[],function(){return function(obj){var __t,__p="",__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,"")};with(obj||{}){__p+="<h1>\n    Message\n</h1>\n<p>\n    "+((__t=(message))==null?"":__t)+"\n</p>"}return __p}});require({paths:{templates:"../templates",underscore:"libs/underscore",text:"libs/text",tpl:"libs/tpl"},shim:{underscore:{exports:"_"}}},["tpl!templates/message"],function(a){console.log("template = "+a);document.body.innerHTML+=a({message:"Hello World!"})});define("main",function(){});