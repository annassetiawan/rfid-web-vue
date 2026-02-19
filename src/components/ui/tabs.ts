import type { ComputedRef, InjectionKey } from 'vue'

export type TabsContext = {
  value: ComputedRef<string>
  setValue: (next: string) => void
}

export const tabsInjectionKey: InjectionKey<TabsContext> = Symbol('tabs')
