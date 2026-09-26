/* Small helpers shared by the step views. */
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
export const wait = (ms: number) => (reducedMotion() ? 0 : ms)
export const matches = (test: string, text: string) => {
  try {
    return new RegExp(test, "i").test(text)
  } catch {
    return false
  }
}
