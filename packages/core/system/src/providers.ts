import type { Dict } from "@beae-ui/utils"
import type { SystemStyleObject } from "@beae-ui/styled-system"
import type { ComputedRef } from "vue"

import { createContext } from "@beae-ui/utils"

const [StylesProvider, useStyles] = createContext<
  ComputedRef<Dict<SystemStyleObject>>
>({
  name: "StylesContext",
  errorMessage:
    "useStyles: `styles` is undefined. Seems you forgot to provide `StylesProvider(...)` ",
})

export { StylesProvider, useStyles }

export const createStylesContext = <AnatomyParts extends readonly string[]>(
  componentName: string,
) =>
  createContext<
    ComputedRef<{ [K in AnatomyParts[number]]: SystemStyleObject }>
  >({
    name: `${componentName}StylesContext`,
    errorMessage: `useStyles: "styles" is undefined. Seems you forgot to wrap the components in "<${componentName} />" `,
  })
