export function add(a = 0, b = 0) {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (multiply(a, e) + multiply(b, e)) / e;
}

export function subtract(a = 0, b = 0) {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (multiply(a, e) - multiply(b, e)) / e;
}


export function multiply(a = 0, b = 0) {
  let c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

export function divide(a = 0, b = 0) {
  let c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), multiply(c / d, Math.pow(10, f - e));
}

export default {
  add,
  subtract,
  multiply,
  divide
}
