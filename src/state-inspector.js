/*
Copyright (c) 2015, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
/**
This utility print out the state, reconsume and extraLogic flag based on chType and previous state.
*/
var Debug = require("debug"),
    progname = 'HTML-State';

Debug.enable(progname);

(function() {
    var Parser = require("./context-parser").Parser,
        StateMachine = require("./context-parser").StateMachine,
        ch,
        symbol,
        state,
        newState,
        reconsume,
        extraLogic,
        noofargs = 0,
        parser = new Parser();

    process.argv.forEach(function(val, index) {
        ++noofargs;
        if (index === 2) {
            ch = val;
        } else if (index === 3) {
            state = val;
        }
    });

    if (noofargs === 4) {
        symbol = parser.lookupChar(ch);
        newState = StateMachine.lookupStateFromSymbol[symbol][state];
        reconsume = StateMachine.lookupReconsumeFromSymbol[symbol][state];
        extraLogic = StateMachine.lookupAltLogicFromSymbol[symbol][state];
        console.log( { ch: ch, symbol: symbol, newState: newState, reconsume: reconsume, extraLogic: extraLogic } );
        process.exit(0);
    } else {
        console.log("Usage: state-inspector char state");
        process.exit(1);
    }

}).call(this);
