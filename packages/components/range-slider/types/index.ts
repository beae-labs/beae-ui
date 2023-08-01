export type PropGetter<P = Record<string, unknown>> = (props?: P) => R

export type RequiredPropGetter<P = Record<string, unknown>> = (props: P) => R
