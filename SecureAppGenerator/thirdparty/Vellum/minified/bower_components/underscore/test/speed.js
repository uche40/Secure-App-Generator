(function(){var b=[];for(var d=0;d<1000;d++){b.push(d)}var e=_.map(b,function(f){return{num:f}});var c=_.sortBy(b,function(){return Math.random()});var a=_.map(_.range(100),function(){return _.range(1000)});JSLitmus.test("_.each()",function(){var f=[];_.each(b,function(g){f.push(g*2)});return f});JSLitmus.test("_(list).each()",function(){var f=[];_(b).each(function(g){f.push(g*2)});return f});JSLitmus.test("jQuery.each()",function(){var f=[];jQuery.each(b,function(){f.push(this*2)});return f});JSLitmus.test("_.map()",function(){return _.map(e,function(f){return f.num})});JSLitmus.test("jQuery.map()",function(){return jQuery.map(e,function(f){return f.num})});JSLitmus.test("_.pluck()",function(){return _.pluck(e,"num")});JSLitmus.test("_.uniq()",function(){return _.uniq(c)});JSLitmus.test("_.uniq() (sorted)",function(){return _.uniq(b,true)});JSLitmus.test("_.sortBy()",function(){return _.sortBy(b,function(f){return -f})});JSLitmus.test("_.isEqual()",function(){return _.isEqual(b,c)});JSLitmus.test("_.keys()",function(){return _.keys(e)});JSLitmus.test("_.values()",function(){return _.values(e)});JSLitmus.test("_.intersection()",function(){return _.intersection(b,c)});JSLitmus.test("_.range()",function(){return _.range(1000)});JSLitmus.test("_.flatten()",function(){return _.flatten(a)})})();