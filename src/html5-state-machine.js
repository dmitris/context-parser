/*
Copyright (c) 2015, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
var StateMachine = {};

/* Character ASCII map */
StateMachine.Char = {};
StateMachine.Char.TAB = 0x09;
StateMachine.Char.LF = 0x0A;
StateMachine.Char.FF = 0x0C;
StateMachine.Char.SPACE = 0x20;
StateMachine.Char.EXCLAMATION = 0x21;
StateMachine.Char.DOUBLE_QUOTE = 0x22;
StateMachine.Char.AMPERSAND = 0x26;
StateMachine.Char.SINGLE_QUOTE = 0x27;
StateMachine.Char.DASH = 0x2D;
StateMachine.Char.SLASH = 0x2F;
StateMachine.Char.GREATER = 0x3C;
StateMachine.Char.EQUAL = 0x3D;
StateMachine.Char.LESS = 0x3E;
StateMachine.Char.QUESTION = 0x3F;
StateMachine.Char.CAPTIAL_A = 0x41;
StateMachine.Char.CAPTIAL_Z = 0x5A;
StateMachine.Char.SMALL_A = 0x61;
StateMachine.Char.SMALL_Z = 0x7A;

StateMachine.State = {};
StateMachine.State.STATE_UNKNOWN = 0;
StateMachine.State.STATE_DATA = 1;
StateMachine.State.STATE_RCDATA = 3;
StateMachine.State.STATE_RAWTEXT = 5;
StateMachine.State.STATE_SCRIPT_DATA = 6;
StateMachine.State.STATE_PLAINTEXT = 7;
StateMachine.State.STATE_TAG_OPEN = 8;
StateMachine.State.STATE_END_TAG_OPEN = 9;
StateMachine.State.STATE_TAG_NAME = 10;
StateMachine.State.STATE_RCDATA_LESS_THAN_SIGN = 11;
StateMachine.State.STATE_RCDATA_END_TAG_OPEN = 12;
StateMachine.State.STATE_RCDATA_END_TAG_NAME = 13;
StateMachine.State.STATE_RAWTEXT_LESS_THAN_SIGN = 14;
StateMachine.State.STATE_RAWTEXT_END_TAG_OPEN = 15;
StateMachine.State.STATE_RAWTEXT_END_TAG_NAME = 16;
StateMachine.State.STATE_SCRIPT_DATA_LESS_THAN_SIGN = 17;
StateMachine.State.STATE_SCRIPT_DATA_END_TAG_OPEN = 18;
StateMachine.State.STATE_SCRIPT_DATA_END_TAG_NAME = 19;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPE_START = 20;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPE_START_DASH = 21;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED = 22;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED_DASH = 23;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED_DASH_DASH = 24;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN = 25;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED_END_TAG_OPEN = 26;
StateMachine.State.STATE_SCRIPT_DATA_ESCAPED_END_TAG_NAME = 27;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPE_START = 28;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPED = 29;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPED_DASH = 30;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH = 31;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN = 32;
StateMachine.State.STATE_SCRIPT_DATA_DOUBLE_ESCAPE_END = 33;
StateMachine.State.STATE_BEFORE_ATTRIBUTE_NAME = 34;
StateMachine.State.STATE_ATTRIBUTE_NAME = 35;
StateMachine.State.STATE_AFTER_ATTRIBUTE_NAME = 36;
StateMachine.State.STATE_BEFORE_ATTRIBUTE_VALUE = 37;
StateMachine.State.STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED = 38;
StateMachine.State.STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED = 39;
StateMachine.State.STATE_ATTRIBUTE_VALUE_UNQUOTED = 40;
StateMachine.State.STATE_AFTER_ATTRIBUTE_VALUE_QUOTED = 42;
StateMachine.State.STATE_SELF_CLOSING_START_TAG = 43;
StateMachine.State.STATE_BOGUS_COMMENT = 44;
StateMachine.State.STATE_MARKUP_DECLARATION_OPEN = 45;
StateMachine.State.STATE_COMMENT_START = 46;
StateMachine.State.STATE_COMMENT_START_DASH = 47;
StateMachine.State.STATE_COMMENT = 48;
StateMachine.State.STATE_COMMENT_END_DASH = 49;
StateMachine.State.STATE_COMMENT_END = 50;
StateMachine.State.STATE_COMMENT_END_BANG = 51;
StateMachine.State.STATE_AS_ONE = 999;

StateMachine.Context = {};
StateMachine.Context.OPERATOR = 0;
StateMachine.Context.HTML = 1;
StateMachine.Context.RCDATA = 2;
StateMachine.Context.RAWTEXT = 3;
StateMachine.Context.SCRIPT = 4;
StateMachine.Context.PLAINTEXT = 5;
StateMachine.Context.TAG_NAME = 6;
StateMachine.Context.ATTRIBUTE_NAME = 7;
StateMachine.Context.ATTRIBUTE_VALUE_DOUBLE_QUOTED = 8;
StateMachine.Context.ATTRIBUTE_VALUE_SINGLE_QUOTED = 9;
StateMachine.Context.ATTRIBUTE_VALUE_UNQUOTED = 10;
StateMachine.Context.COMMENT = 11;
StateMachine.Context.BOGUS_COMMENT = 12;
StateMachine.Context.SCRIPT_COMMENT = 13;
StateMachine.Context.SCRIPT_IN_SCRIPT = 14;


StateMachine.Symbol = {};
StateMachine.Symbol.SPACE = 0;
StateMachine.Symbol.EXCLAMATION = 1;
StateMachine.Symbol.QUOTATION = 2;
StateMachine.Symbol.AMPERSAND = 3;
StateMachine.Symbol.APOSTROPHE = 4;
StateMachine.Symbol.HYPHEN = 5;
StateMachine.Symbol.SOLIDUS = 6;
StateMachine.Symbol.LESS = 7;
StateMachine.Symbol.EQUAL = 8;
StateMachine.Symbol.GREATER = 9;
StateMachine.Symbol.QUESTIONMARK = 10;
StateMachine.Symbol.LETTER = 11;
StateMachine.Symbol.ELSE = 12;

StateMachine.lookupStateFromSymbol = {
   0: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,34, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,34,36,36,37,38,39,34, 0,34,34,44,44,48,48,48,48,48,48],
   1: [ 0, 1, 0, 3, 0, 5, 6, 7,45,44,10, 3, 3, 3, 5, 5, 5,20, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,51,48],
   2: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,38,42,39,40, 0,34,34,44,44,48,48,48,48,48,48],
   3: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48],
   4: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,39,38,42,40, 0,34,34,44,44,48,48,48,48,48,48],
   5: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6,21,24,23,24,24,22,22,22,22,30,31,31,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,47,50,49,50,50,49],
   6: [ 0, 1, 0, 3, 0, 5, 6, 7, 9,44,43,12, 3, 3,15, 5, 5,18, 6, 6, 6, 6,22,22,22,26,22,22,22,29,29,29,33,29,43,43,43,40,38,39,40, 0,43,34,44,44,48,48,48,48,48,48],
   7: [ 0, 8, 0,11, 0,14,17, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,25,25,25,22,22,22,22,32,32,32,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48],
   8: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,37,37,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48],
   9: [ 0, 1, 0, 3, 0, 5, 6, 7, 1, 1, 1, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22, 6,22,22,22,22,29,29, 6,29,29, 1, 1, 1, 1,38,39, 1, 0, 1, 1, 1,44, 1, 1,48,48, 1, 1],
  10: [ 0, 1, 0, 3, 0, 5, 6, 7,44,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48],
  11: [ 0, 1, 0, 3, 0, 5, 6, 7,10,10,10, 3,13,13, 5,16,16, 6,19,19, 6, 6,22,22,22,28,27,27,28,29,29,29,29,33,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48],
  12: [ 0, 1, 0, 3, 0, 5, 6, 7, 1,44,10, 3, 3, 3, 5, 5, 5, 6, 6, 6, 6, 6,22,22,22,22,22,22,22,29,29,29,29,29,35,35,35,40,38,39,40, 0,34,34,44,44,48,48,48,48,48,48]
};

StateMachine.lookupAltLogicFromSymbol = {
   0: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 0, 0, 0, 8, 0, 0, 0, 0,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   1: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   2: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12, 0, 0,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   3: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12, 0,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   4: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12, 0,14, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   5: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12,14,14,14,14, 0, 0, 0, 0,10, 0, 0, 0, 0, 0, 0],
   6: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 6, 4, 0, 6, 4, 0, 6, 0, 0, 0, 0, 0, 4, 0, 6, 8, 0, 0, 0, 4, 8, 0, 0, 0,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   7: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   8: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0, 0,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   9: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 0, 0, 6, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 0, 0, 0, 8,11,11,11,11,14,14,11, 0,11,11, 0, 0, 0, 0, 0, 0, 0, 0],
  10: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  11: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 2, 3, 0, 2, 3, 0, 2, 3, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 3,12,13,12,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  12: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,13,12,14,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

StateMachine.lookupReconsumeFromSymbol = {
   0: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   1: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   2: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   3: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   4: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   5: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   6: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   7: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   8: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
   9: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  10: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  11: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  12: [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
};

module.exports = StateMachine;
