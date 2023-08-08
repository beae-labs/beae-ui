export type PropGetter<P = Record<string, unknown>> = (props?: P) => any

export type RequiredPropGetter<P = Record<string, unknown>> = (props: P) => any
