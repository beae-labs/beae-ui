import { createContext } from "@beae-ui/utils"
import { Dict } from "@beae-ui/utils"
import { SystemStyleObject } from "@beae-ui/styled-system"
import { ComputedRef } from "vue"

const [StylesProvider, useStyles] = createContext<
  ComputedRef<Dict<SystemStyleObject> | SystemStyleObject>
>({
  name: "StylesContext",
  errorMessage:
    "useStyles: `styles` is undefined. Seems you forgot to provide `StylesProvider(...)` ",
})

export { StylesProvider, useStyles }

export const createStylesContext = (componentName: string) =>
  createContext<ComputedRef<Dict<SystemStyleObject> | SystemStyleObject>>({
    name: `${componentName}StylesContext`,
    errorMessage: `useStyles: "styles" is undefined. Seems you forgot to wrap the components in "<${componentName} />" `,
  })
