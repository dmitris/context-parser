/*
Copyright (c) 2015, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
(function () {

    require("mocha");
    var assert = require("assert"),
        Parser = require("../../src/context-parser").Parser;

    describe('HTML5 Context Parser html5 state test suite', function(){

        // https://html.spec.whatwg.org/multipage/syntax.html#tokenization
        it('HTML5 Context Parser <html></html> test', function(){
            var p1 = new Parser();

            var html = "<html></html>";
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,1,8,9,10,10,10,10,1');
        });

        it('HTML5 Context Parser attribute name test', function(){
            var p1 = new Parser();

            var html = "<option value='1' selected >";
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,34,35,35,35,35,35,37,39,39,42,34,35,35,35,35,35,35,35,35,36,1');
        });

        it('HTML5 Context Parser double quoted attribute value test', function(){
            var p1 = new Parser();

            var html = '<div class="classname" style="stylestring"></div>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,34,35,35,35,35,35,37,38,38,38,38,38,38,38,38,38,38,42,34,35,35,35,35,35,37,38,38,38,38,38,38,38,38,38,38,38,38,42,1,8,9,10,10,10,1');
        });

        it('HTML5 Context Parser single quoted attribute value test', function(){
            var p1 = new Parser();

            var html = "<div class='classname' style='stylestring'></div>";
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,34,35,35,35,35,35,37,39,39,39,39,39,39,39,39,39,39,42,34,35,35,35,35,35,37,39,39,39,39,39,39,39,39,39,39,39,39,42,1,8,9,10,10,10,1');
        });

        it('HTML5 Context Parser unquoted attribute value test', function(){
            var p1 = new Parser();

            var html = "<div class= classname style= stylestring ></div>";
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,34,35,35,35,35,35,37,37,40,40,40,40,40,40,40,40,40,34,35,35,35,35,35,37,37,40,40,40,40,40,40,40,40,40,40,40,34,1,8,9,10,10,10,1');
        });

        it('HTML5 Context Parser slash double quoted attribute value test', function(){
            var p1 = new Parser();

	    var html = '<a href="javascript:alert(\"1\");">link</a>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,34,35,35,35,35,37,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,34,35,35,35,35,35,1,1,1,1,1,8,9,10,1');
        });

        it('HTML5 Context Parser rcdata test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<html><title>title</title></html>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,1,8,10,10,10,10,10,3,3,3,3,3,3,11,12,13,13,13,13,13,1,8,9,10,10,10,10,1');
        });

        it('HTML5 Context Parser rcdata with space end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<html><title>title</title ></html>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,1,8,10,10,10,10,10,3,3,3,3,3,3,11,12,13,13,13,13,13,34,1,8,9,10,10,10,10,1');
        });

        it('HTML5 Context Parser double slash in rcdata end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<html><title>title</title/></html>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,1,8,10,10,10,10,10,3,3,3,3,3,3,11,12,13,13,13,13,13,43,1,8,9,10,10,10,10,1');
        });

        it('HTML5 Context Parser <script> tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<script>var a = 0;</script>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,1');
        });

        it('HTML5 Context Parser <script> with space end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<script>var a = 0;</script >';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,34,1');
        });

        it('HTML5 Context Parser double slash in <script> end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<script>var a = 0;</script/>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,43,1');
        });

        it('HTML5 Context Parser <style> tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<style>style</style>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,5,5,5,5,5,5,14,15,16,16,16,16,16,1');
        });

        it('HTML5 Context Parser <style> with space end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<style>style</style >';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,5,5,5,5,5,5,14,15,16,16,16,16,16,34,1');
        });

        it('HTML5 Context Parser double slash in <style> end tag test (extra logic:6)', function(){
            var p1 = new Parser();

	    var html = '<style>style</style/>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,5,5,5,5,5,5,14,15,16,16,16,16,16,43,1');
        });

        it('HTML5 Context Parser <script> comment test (extra logic:8)', function(){
            var p1 = new Parser();
	    var html = '<script><!-- script --> script data</script>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,17,20,21,24,22,22,22,22,22,22,22,22,23,24,6,6,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,1');

            p1 = new Parser();
	    var html = '<script><!-- <script --> script data</script>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,17,20,21,24,22,25,28,28,28,28,28,28,29,30,31,6,6,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,1');
        });

        it('HTML5 Context Parser comment tag test (extra logic:10)', function(){
            var p1 = new Parser();

	    var html = '<!--comment-->';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,45,999,46,48,48,48,48,48,48,48,49,50,1');
        });

        it('HTML5 Context Parser extra logic 11 test', function(){
            var p1 = new Parser();
	    var html = '<script>var a = 0;</script>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,6,6,6,6,6,6,6,6,6,6,6,17,18,19,19,19,19,19,19,1');

            p1 = new Parser();
	    html = '<noframes>noframes</noframes>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,10,10,5,5,5,5,5,5,5,5,5,14,15,16,16,16,16,16,16,16,16,1');

            p1 = new Parser();
	    html = '<xmp>xmptext</xmp>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,5,5,5,5,5,5,5,5,14,15,16,16,16,1');

            p1 = new Parser();
	    html = '<iframe></iframe>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,5,14,15,16,16,16,16,16,16,1');

            p1 = new Parser();
	    html = '<noembed></noembed>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,10,5,14,15,16,16,16,16,16,16,16,1');

            p1 = new Parser();
	    html = '<noscript></noscript>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,10,10,5,14,15,16,16,16,16,16,16,16,16,1');

            p1 = new Parser();
	    html = '<textarea></textarea>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,10,10,3,11,12,13,13,13,13,13,13,13,13,1');

            /* reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/plaintext */
            p1 = new Parser();
	    html = '<plaintext></plaintext>';
            p1.contextualize(html);
            var states = p1.getStates();
            assert.equal(states.toString(), '1,8,10,10,10,10,10,10,10,10,10,7,7,7,7,7,7,7,7,7,7,7,7,7');
        });
    });
}());
