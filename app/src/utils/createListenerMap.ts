type EventMap<T> = T extends HTMLElement
  ? HTMLElementEventMap
  : T extends Document
  ? DocumentEventMap
  : T extends Window
  ? WindowEventMap
  : never

export function createListenerMap<
  T extends HTMLElement | Document | Window,
  K extends keyof EventMap<T>
>(
  target: T | undefined | null,
  listeners: Record<K, (event: EventMap<T>[K]) => void>
) {
  for (const name in listeners)
    target?.addEventListener(name, listeners[name] as EventListener)
  return () => {
    for (const name in listeners)
      target?.removeEventListener(name, listeners[name] as EventListener)
  }
}
