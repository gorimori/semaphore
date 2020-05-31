/**
 * @see https://gist.github.com/Gericop/e33be1f201cf242197d9c4d0a1fa7335
 */

type Task = {
  res: () => unknown;
  rej: (msg?: string) => unknown;
};

export class Semaphore {
  readonly #max: number;
  #counter: number = 0;
  #tasks: Task[] = [];

  constructor(max: number) {
    if (max < 1) {
      throw new Error("'max' must be larger than 0");
    }

    this.#max = max;
  }

  acquire(): Promise<unknown> {
    if (this.#counter < this.#max) {
      this.#counter += 1;
      return new Promise((res) => res());
    }

    return new Promise((res, rej) => {
      this.#tasks.push({ res, rej });
    });
  }

  release(): void {
    if (this.#counter < 1) {
      return;
    }

    this.#counter -= 1;
    if (this.#tasks.length < 1) {
      return;
    }

    this.#counter += 1;
    this.#tasks.shift()?.res();
  }

  purge(): number {
    const unresolved = this.#tasks.length;
    for (const task of this.#tasks) {
      task.rej("Task has been purged.");
    }

    this.#counter = 0;
    this.#tasks = [];
    return unresolved;
  }
}
