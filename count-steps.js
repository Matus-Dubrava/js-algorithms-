// PROBLEM there are stairs that you have to climb. You can take 1 or 2 steps
// at a time. In how many ways you can climb the stairs? Use recursion to solve
// this problem.

// E.g. you can climb 4 stairs in 5 ways
//   1 -> 1 -> 1 ->1
//   1 -> 1 -> 2
//   1 -> 2 -> 1
//   2 -> 1 -> 1
//   2 -> 2

// SOLUTION:

// First, let's see what we can deduce about the problem at hand.

// At any given time we can take 1 or 2 steps but if there is only one stair
// left, then obviously we can take only 1 step.

// If we are done, then it basically means that there are not stairs left to
// be climbed. (This is going to be our base case for recursion).

// So we have our base case and we also know what to do at each point of our
// jurney to the top, therefore we are prepared to start designing algorithm
// that, hopefully, will solve the problem.

// Since we are going to use recursion, good choice of our function's signature
// is essential (There are usually many ways to choose signature of function
// for given problem but choosing a good one is important. Not only it guide us
// during the design of function's body, but it is also necessary later when we
// upgrade the function for a better performance.).

// Let's not make it too complicated and think for a second about what changes
// (which parameter of the problem) when we take a step. Well, there are 1 or
// 2 steps less to take, therefore we can use this as a parameter of the function.

   // function countSteps(stairsLeft)

// Next thing to do, as with every recursive function is to set up a base case,
// or in other words, set up a condition under which the function stops recursing
// (calling itself) and simply returns. But we already know when, that is, when
// there are no more stairs to climb.

    // if (stairsLeft === 0) { return 1; }

// We are returning 1 here which signals that we have found (one) solution. While
// this works, let's refactor it a bit and instead of returning that 1, assign it
// to some variable that will hold the number of solutions.

    // let noSolutions = 0;
    // if (stairsLeft === 0) { noSolutions = 1 };

// Now what to do when there is only one stair left. We could try to take two
// steps anyway and fail (we will see similar approach later) but since we know that
// there are only two options at any given time (take 1 or 2 steps), we can eliminate
// one of the in this case.

    // if (stairsLeft === 1) { noSolutions = countSteps(stairsLeft-1); }

// Call to function "countSteps" takes one less stair to climb as argument, because
// we are essentially climbing that stair by calling that function. Ok, but what
// if there are more then just 1 stair left. Well, we have to take both possibilities
// into account.

    // noSolutions = countSteps(stairsLeft - 1) + countSteps(stairsLeft - 2);

// As the last step, we need to combine all these parts together.

(() => {

  function countSteps(stairsLeft) {
    let noSolutions = 0;

    if (stairsLeft === 0) {
      noSolutions = 1
    } else if (stairsLeft === 1) {
      noSolutions = countSteps(stairsLeft-1);
    } else {
      noSolutions = countSteps(stairsLeft - 1) + countSteps(stairsLeft - 2);
    }

    return noSolutions;
  }

  console.log(countSteps(4)); // <- returns 5
  console.log(countSteps(5)); // <- returns 8
  console.log(countSteps(6)); // <- returns 13

})();

// If we tests this version of countSteps, we will find out that it works correctly,
// but there is one problem with it. Try passing some larger number such as 60 to
// this function and see what happens, or rather wait to see what happens. Now,
// after a bit of waiting you should probably cut the process off (trust me, you don't
// want to be waiting for the outcome of that computation).

// Even though our algorithm looks ok, its time complexity is, unfortunatelly, exponential.
// If we have "n" stairs to climb and we have two options at each step, the amount of
// computational steps that we have to perform is 2^n.

// So the question is, can we
// do something about this? Can we upgrade this algorithm such that its complexity
// is asymptotically lower than the exponential one that we have right now?
// The answer is yes. But to see it, let's visualize current computation (for
// 4 stairs). CS - countSteps.

//                               CS(4)
//                         /            \
//                      CS(3)             CS(2)
//                   /       \             \    \
//               CS(2)     CS(1)          CS(1)   CS(0)
//             /      \       |             |
//          CS(1)   CS(0)    CS(0)        CS(0)
//            |
//          CS(0)

// From the picture abowe, we can see that CS(1) is called 3 times, and CS(2) is
// called two times (the more stairs we have initially, the more repetition there
// will be). We also know that the result of CS(2), no matter how many times we perform
// that computation, will still be the same. So how do we, remove this reppetition
// from our algorithm? We will simply use memoization, in other words, we will cache
// all the partial results and when our algorithm needs them, instead of recomputing
// the same thing over and over, we retrieve it from the cache. We keep the rest
// of the function as it is.

(() => {

  function countSteps(stairsLeft) {
    const cache = new Map();

    function _countSteps(stairsLeft) {
      let noSolutions = 0;

      // there is a solution for this particular input,
      // retrieve it instead of computing it anew
      if (cache.has(stairsLeft)) {
        noSolutions = cache.get(stairsLeft);
      } else if (stairsLeft === 0) {
        noSolutions = 1
      } else if (stairsLeft === 1) {
        noSolutions = _countSteps(stairsLeft-1);
      } else {
        noSolutions = _countSteps(stairsLeft - 1) +_countSteps(stairsLeft - 2);
      }

      // store the result so that it doesn't have to be computed next time
      // it is needed
      cache.set(stairsLeft, noSolutions);
      return noSolutions;
    }

    return _countSteps(stairsLeft);
  }

  console.log(countSteps(4)); // <- returns 5
  console.log(countSteps(5)); // <- returns 8
  console.log(countSteps(6)); // <- returns 13

  console.log(countSteps(60)); // <- returns 13

})();

// In the algorithm above, we have traded a little bit of computer memory for
// significant performance boost. Since we need to store partial results for
// every possible input, the space complexity, with respect to the input, is
// linear (if we need to climb 60 steps, we need to store partial results for
// 60, 59, 58, 57, ..., 3, 2, 1 steps) but the time complexity is also
// linear, but it might not be obvious at a first glance so, again, let's draw
// computation diagram.

//                                CS(4)
//                               /
//                             CS(3)
//                            /
//                          CS(2)
//                         /
//                      CS(1)
//                        |
//                      CS(0) <- ans 1 (store it)


// This is just the start of our recursion. Since there is not repetition yet,
// we need to perform each of the above steps. But as we are doing so, we
// are also storing the partial results so let's continue.

//                                CS(4)
//                               /
//                             CS(3)
//                            /
//                          CS(2)
//                         /
//   ans 1 (store it) -> CS(1)
//                        |
//                       CS(0) <- ans 1 (store it)


//                                CS(4)
//                               /
//                             CS(3)
//                            /
//                          CS(2)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0)
//                        |
//                       CS(0) <- ans 1 (store it)


//                                CS(4)
//                               /
//                             CS(3)
//                            /
//                          CS(2)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)



//                                CS(4)
//                               /
//                             CS(3)
//                            /
//     ans 2 (store it) ->  CS(2)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)



//                                CS(4)
//                               /
//                             CS(3)
//                            /     \
//     ans 2 (store it) ->  CS(2)   CS(1)  <- ans 1 (from cache)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)



//                                CS(4)
//                               /
//       ans 3 (store it) ->   CS(3)
//                            /     \
//     ans 2 (store it) ->  CS(2)   CS(1)  <- ans 1 (from cache)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)



//                                CS(4)
//                               /    \
//       ans 3 (store it) ->   CS(3)   CS(2)  <- ans 2 (from cache)
//                            /     \
//     ans 2 (store it) ->  CS(2)   CS(1)  <- ans 1 (from cache)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)



//  ans 5 (store it, return)      CS(4)
//                               /    \
//       ans 3 (store it) ->   CS(3)   CS(2)  <- ans 2 (from cache)
//                            /     \
//     ans 2 (store it) ->  CS(2)   CS(1)  <- ans 1 (from cache)
//                         /     \
//   ans 1 (store it) -> CS(1)  CS(0) <- ans 1 (from cache)
//                        |
//                       CS(0) <- ans 1 (store it)

// So as we can see, we are completely skipping computations that would
// happen on the right side of the tree, instead, we are reusing the
// already computed results.


// Now, let's look on slight modification of the problem, what if we have longer
// legs (or stairs would be shorter) so that we could take more than just 1 or 2
// steps at a time. What if the number of steps we can take each time we are
// faced with such decission is unknown at the time we are designing the
// algorithm that needs to solve it.

// Instead of hard coding options such as "if there is only one stair left, take
// only one step" (there might not even be possible for us to take just one step,
// depending on the input), we will loop through all the possible values at
// each point of computation if we are able to take so many steps, do it and
// continue with next value, if not, skip it.

// We will also pass array containg possible steps to be taken as a second argument
// to our new function.

(() => {

  function countSteps(stepsLeft, options) {
    let count = 0;

    options.forEach((opt) => {
      if (stepsLeft - opt === 0) {
        count += 1;
      } else if (stepsLeft - opt > 0) {
        count += countSteps(stepsLeft - opt, options);
      }
    });

    return count;
  }

  console.log(countSteps(4, [1, 2])); // <- returns 5
  console.log(countSteps(5, [1, 2])); // <- returns 8
  console.log(countSteps(6, [1, 2])); // <- returns 13

  console.log(countSteps(6, [1, 2, 3])); // <- returns 24
})();

// We should probably pay attention to passing only correct "options" such as
// no negative values (we disallow steps back) and we should also remove
// duplicate values it.

// But again, we should probably memoize this algorithm to make it useful.


(() => {

  function countSteps(stepsLeft, options) {
    const cache = new Map();

    function _countSteps(stepsLeft, options) {
      let count = 0;
      if (cache.has(stepsLeft)) {
        count = cache.get(stepsLeft);
      } else {
        options.forEach((opt) => {
          if (stepsLeft - opt === 0) {
            count += 1;
          } else if (stepsLeft - opt > 0) {
            count += _countSteps(stepsLeft - opt, options);
          }
        });
      }

      cache.set(stepsLeft, count);
      return count;
    }

    return _countSteps(stepsLeft, options);
  }

  console.log(countSteps(30, [1, 2, 3]));

})();
