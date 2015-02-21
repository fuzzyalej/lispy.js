function cell(value) {
  return {
    value: value,
    next: null
  };
}

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

function first(list) {
  if(list === null) return null;
  return list.value;
}
var car = first;
var head = first;

function rest(list) {
  if(list === null) return null;
  return list.next;
}
var cdr = rest;
var tail = rest;

function last(list) {
  if(rest(list) === null) return first(list);
  return last(rest(list));
}

function length(list) {
  if(list === null) return 0;
  return 1 + length(rest(list));
}

//example
function replace_first(value, list) {
  return cons(value, rest(list));
}

function nth(position, list) {
  if(position > length(list) || position < 1) return null;
  return (function recurr(we_are_at, list){
    if(position === we_are_at) return first(list);
    return recurr(we_are_at + 1, rest(list));
  }(1, list));
}

function print(list) {
  if(list === null) return '';
  return ('' + first(list) + ' ' + rest(cdr(list)));
}

function listp(input) {
  if(input === null) return null;
  return (typeof(input) === 'object')
  && input.hasOwnProperty('value')
  && input.hasOwnProperty('next');
}

function atomp(input) { return !listp(input); }

function nullp(input) { return input === null; }

function predicatep(input) { return input === true || input === false; }

function not(predicate) { return !!!predicate; }

function append(list1, list2) {
  if(not(listp(list1)) && not(listp(list2))) return null;

  if(rest(list1) === null) { return cons(list1.value, list2); }
  return cons(first(list1), append(rest(list1), list2));
}

function reverse(list) {
  if(not(listp(list))) return null;
  if(rest(list) === null) return cell(first(list));
  return append(reverse(rest(list)), cell(first(list)));
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

function dec(element) {
  return parseInt(element) - 1;
}

function map(list, fn) {
  if(not(listp(list))) return null;
  return cons(fn(list.value), map(list.next, fn));
}

function filter(list, predicatefn) {
  if(not(listp(list))) return null;

  if(list.next === null) return predicatefn(list.value) ? cell(list.value) : '';
  if(predicatefn(list.value)) return cons(list.value, filter(list.next, predicatefn));
  return filter(list.next, predicatefn);
}

function count(value, list) {
  return length(filter(list, function(e) { return e === value; }));
}

function find(list, predicate) {
  //TODO: a lot of room for improvement, like lazy evaluation :P
  return first(filter(list, predicate));
}

function remove_if(list, predicate) {
  return filter(list, function(e) {return !predicate(e);});
}

function reduce(list, initial_value, fn) {
  if(list === null) return initial_value;
  return reduce(rest(list), fn(initial_value, first(list)), fn);
}

function reduceRight(list, initial_value, fn) {
  if(list === null) return initial_value;
  return fn(reduceRight(rest(list), initial_value, fn), first(list));
}
var foldR = reduceRight;

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

//function compose() {
//  var fns = Array.prototype.slice(arguments);
//  return function() {
//    var args = Array.prototype.slice(arguments);
//    return reduce(fns, args, function(fn) {
//      return fn(args);
//    });
//  };
//}

// Thanks to Elias
function fork(predicate, f, g) {
  return function() {
    if(predicate.apply(null, arguments))
      return f.apply(null, arguments);
    else
      return g.apply(null, arguments);
  };
}

// Thanks to Elias
function serial(f, g) {
  return function() {
    f.apply(null, arguments);
    g.apply(null, arguments);
  };
}
