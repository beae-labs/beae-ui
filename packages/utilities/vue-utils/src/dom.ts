import { defineComponent } from "vue"

/** Vue Component HTML Element Instance */
export type VueComponentInstance = InstanceType<
  ReturnType<typeof defineComponent>
>

/**
 * Interface for node provided by template ref
 */
export type TemplateRef = Element | VueComponentInstance | undefined | null
