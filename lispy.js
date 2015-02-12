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

function remove(element, list) { //TODO: I need here a 'list terminator', better than this
  if(not(listp(list))) return null;
  if(list.next === null) return list.value == element ? '' : cell(list.value);
  if(list.value === element) return remove(element, list.next);
  return cons(list.value, remove(element, list.next));
}

function inc(element) {
  return parseInt(element) + 1;
}

function map(list, fn) {
  if(not(listp(list))) return null;
  if(list.next === null) return cell(fn(list.value));
  return cons(fn(list.value), map(list.next, fn));
}

function filter(list, predicatefn) {
  if(not(listp(list))) return null;

  if(list.next === null) return predicatefn(list.value) ? cell(list.value) : '';
  if(predicatefn(list.value)) return cons(list.value, filter(list.next, predicatefn));
  return filter(list.next, predicatefn);
}

function find(list, predicate) {
  //TODO: a lot of room for improvement, like lazy evaluation :P
  return first(filter(list, predicate));
}

function remove_if(list, predicate) {
  return filter(list, function(e) {return !predicate(e);});
}

//The implementation might vary on the initial value: given, the first value of the list... or even pass an index to the host fn
function reduceRight(list, initial_value, fn) {
  if(list.next === null) return fn(initial_value, list.value);
  return fn(reduceRight(list.next, initial_value, fn), list.value);
}

function reduceLeft(list, initial_value, fn) {
  return reduceRight(reverse(list), initial_value, fn);
}
var reduce = reduceLeft;
///

function every(list, fn) {
  return reduce(list, true, function(acc, el) {
    return acc && fn(el);
  });
}

function any(list, fn) {
  return reduce(list, false, function(acc, el) {
    return acc || fn(el);
  });
}

function partition(list, fn) {
  return(function recurr(group1, group2, list, fn){
    if(fn(list.value)) {
      group1.push(list.value);
    } else {
      group2.push(list.value);
    }

    if(list.next === null) return;

    recurr(group1, group2, list.next, fn);
    return [group1, group2];
  }([], [], list, fn));
}

function groupBy(list, fn) {
  return(function recurr(groups, list, fn){
    result = fn(list.value);
    (groups[result] = groups[result] || []).push(list.value);

    if(list.next === null) return groups;

    recurr(groups, list.next, fn);
    return groups;
  }({}, list, fn));
}

function memoize(fn) {
  var cache = {};
  return function(argument) {
    cache[argument] = cache[argument] || fn(argument);
    return cache[argument];
  };
}

function partial(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var args2 = Array.prototype.slice.call(arguments);
    return fn.apply(this, args.concat(args2));
  };
}