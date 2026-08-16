// Lets the header's logo link reset SalaryCompareApp back to its
// calculator view when the user is already on "/" (a same-route Link
// click doesn't remount the page, so there's nothing else to hook into).
let listener: (() => void) | null = null;

export function registerHomeReset(fn: (() => void) | null) {
  listener = fn;
}

export function triggerHomeReset() {
  listener?.();
}
