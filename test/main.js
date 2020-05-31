// @ts-check
import { Semaphore } from "../build/main.js";

let sema = new Semaphore(2);

async function test(id) {
  console.log("queueing task", id);

  try {
    await sema.acquire();
    console.log("running task", id);
    setTimeout(() => {
      sema.release();
    }, 2000);
  } catch (e) {
    console.error(id, e);
  }
}

test(1);
test(2);
test(3);
test(4);
test(5);

setTimeout(() => {
  test(10);
  test(11);
  test(12);
}, 1500);

setTimeout(() => {
  test(20);
  test(21);
  test(22);
}, 2700);

// PURGE TEST
// // setTimeout(() => {
// //   purge(sema);
// }, 2200);
