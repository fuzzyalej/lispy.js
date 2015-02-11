function cell(value, next) {
  return {
    value: value,
    next: next || null
  };
}


function length(list) {
  if(list.next === null) return 1;
  return 1 + length(list.next);
}

function first(list) {
  if(list === null) return null;
  return list.value;
}

function rest(list) {
  if(list === null) return null;
  return list.next;
}

//Maybe in this point we should define a nil() function that will return an empty cell, and reformat all the previous functions to use that, so we keep consistency and don't break on first(rest(cell(1))). nil() == cons(null) ???

var car = first;
var cdr = rest;

function cons(value, list) {
  var tmp = cell(value);
  tmp.next = list || null;
  return tmp;
}

function list() {
  if(arguments[0] === undefined) return null;
  var args = Array.prototype.slice.call(arguments);
  return cons(args[0], list.apply(this, args.slice(1)));
}

//example
function replace_first(value, list) {
  return cons(value, rest(list));
}

function listp(input) {
  return (typeof(input) === 'object') && input.hasOwnProperty('value') && input.hasOwnProperty('next');
}

function atomp(input) {
  return !listp(input);
}

function notp(predicate) {
  return !!!predicate;
}

function nullp(input) {
  return input === null;
}

function predicatep(input) {
  return input === true || input === false;
}

function and(x, y) {
  return x && y;
}

function or(x, y) {
  return x && y;
}

function print(list) {
  if(list === null) return '';
  return ('' + car(list) + ' ' + print(cdr(list)));
}

function cell(value, next) {
  return {
    value: value,
    next: next || null
  };
}


function length(list) {
  if(list.next === null) return 1;
  return 1 + length(list.next);
}

function first(list) {
  if(list === null) return null;
  return list.value;
}

function rest(list) {
  if(list === null) return null;
  return list.next;
}

//Maybe in this point we should define a nil() function that will return an empty cell, and reformat all the previous functions to use that, so we keep consistency and don't break on first(rest(cell(1))). nil() == cons(null) ???

var car = first;
var cdr = rest;

function cons(value, list) {
  var tmp = cell(value);
  tmp.next = list || null;
  return tmp;
}

function list() {
  if(arguments[0] === undefined) return null;
  var args = Array.prototype.slice.call(arguments);
  return cons(args[0], list.apply(this, args.slice(1)));
}

//example
function replace_first(value, list) {
  return cons(value, rest(list));
}

function listp(input) {
  return (typeof(input) === 'object') && input.hasOwnProperty('value') && input.hasOwnProperty('next');
}

function atomp(input) {
  return !listp(input);
}

function nullp(input) {
  return input === null;
}

function predicatep(input) {
  return input === true || input === false;
}

function not(predicate) {
  return !!!predicate;
}

function and(x, y) {
  return x && y;
}

function or(x, y) {
  return x && y;
}

function print(list) {
  if(list === null) return '';
  return ('' + car(list) + ' ' + print(cdr(list)));
}

//Some error management would be awesome (raises)

function append(list1, list2) {
  if(not(listp(list1)) && not(listp(list2))) return null;

  if(list1.next === null) {
    return cons(list1.value, list2);
  }
  return cons(list1.value, append(list1.next, list2));
}

function reverse(list) {
  if(not(listp(list))) return null;
  if(list.next === null) return cell(list.value);
  return append(reverse(list.next), cell(list.value));
}
