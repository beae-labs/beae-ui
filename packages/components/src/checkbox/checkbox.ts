import { defineComponent, h, defineProps, inject, expose } from "vue"
import { useCheckbox } from './use-checkbox';
import { MinusMinor, TickSmallMinor } from '@shopify/polaris-icons';

import { classNames } from '../../utilities/css';
import type { ResponsiveProp } from '../../utilities/css';
import type { ChoiceBleedProps } from '../Choice';
import { Choice, helpTextID } from '../Choice';
import { errorTextID } from '../InlineError';
import { Icon } from '../Icon';
import type { Error, CheckboxHandles } from '../../types';
import { WithinListboxContext } from '../../utilities/listbox/context';
import { useFeatures } from '../../utilities/features';

import styles from './Checkbox.scss';

export interface CheckboxProps extends ChoiceBleedProps {
    /** Indicates the ID of the element that is controlled by the checkbox */
    ariaControls?: string;
    /** Indicates the ID of the element that describes the checkbox */
    ariaDescribedBy?: string;
    /** Label for the checkbox */
    //   label: React.ReactNode; use slot label
    /** Visually hide the label */
    labelHidden?: boolean;
    /** Checkbox is selected. `indeterminate` shows a horizontal line in the checkbox */
    checked?: boolean | 'indeterminate';
    /** Disable input */
    disabled?: boolean;
    /** ID for form input */
    id?: string;
    /** Name for form input */
    name?: string;
    /** Value for form input */
    value?: string;
    /** Callback when checkbox is toggled */
    onChange?(newChecked: boolean, id: string): void;
    /** Callback when checkbox is focused */
    onFocus?(): void;
    /** Callback when focus is removed */
    onBlur?(): void;
    /** Added to the wrapping label */
    labelClassName?: string;
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill?: boolean;
    /** Additional text to aide in use */
    //   helpText?: React.ReactNode; use slot helpText
    /** Display an error message */
    error?: Error | boolean;
}
const props = defineProps<CheckboxProps>();
export const Button = defineComponent({
    props,
    setup(_, { slots, props }) {
        const inputNode = ref<HTMLInputElement>(null);
        const uniqId = useId();
        const id = idProp ?? uniqId;
        const isWithinListbox = inject(WithinListboxContext);
        const { polarisSummerEditions2023 } = useFeatures();
        // Function to focus the input
        const focusInput = () => {
            if (inputRef.value) {
                inputRef.value.focus();
            }
        };
        // Exporting the ref and the focusInput function to be exposed
        expose({ inputRef, focusInput });

        const handleBlur = () => {
            props.onBlur && props.onBlur();
        };

        const handleOnClick = () => {
            if (props.onChange == null || inputNode.value == null || props.disabled) {
                return;
            }

            props.onChange(inputNode.value.checked, props.id);
            inputNode.value.focus();
        };

        const describedBy: string[] = [];
        if (props.error && typeof props.error !== 'boolean') {
            describedBy.push(errorTextID(props.id));
        }
        if (slots.helpText) {
            describedBy.push(helpTextID(props.id));
        }
        const ariaDescribedByProp = props.ariaDescribedBy;
        if (ariaDescribedByProp) {
            describedBy.push(ariaDescribedByProp);
        }
        const ariaDescribedBy = describedBy.length
            ? describedBy.join(' ')
            : undefined;

        const wrapperClassName = classNames(styles.Checkbox, props.error && styles.error);

        const isIndeterminate = props.checked === 'indeterminate';
        const isChecked = !isIndeterminate && Boolean(props.checked);

        const indeterminateAttributes = isIndeterminate
            ? { indeterminate: 'true', 'aria-checked': 'mixed' as const }
            : { 'aria-checked': isChecked };
        // TODO: chuyển sang remixicon
        const iconSource = isIndeterminate ? MinusMinor : TickSmallMinor;

        const animatedTickIcon = polarisSummerEditions2023 && !isIndeterminate;

        const iconSourceSe23 = h('svg', {
            viewBox: "0 0 16 16",
            shapeRendering: "geometricPrecision"
            textRendering: "geometricPrecision"
        }, h('path', {
            className: classNames(props.checked && styles.checked),
            d: "M1.5,5.5L3.44655,8.22517C3.72862,8.62007,4.30578,8.64717,4.62362,8.28044L10.5,1.5",
            transform: "translate(2 2.980376)",
            opacity: "0",
            fill: "none",
            stroke: "#fff",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            pathLength: "1"
        }));

        const inputClassName = classNames(
            styles.Input,
            isIndeterminate && styles['Input-indeterminate'],
        );

        const extraChoiceProps = {
            error: props.error,
            bleed: props.bleed,
            bleedBlockStart: props.bleedBlockStart,
            bleedBlockEnd: props.bleedBlockEnd,
            bleedInlineStart: props.bleedInlineStart,
            bleedInlineEnd: props.bleedInlineEnd
        };
        return h('Choice', {
            id: id,
            labelHidden: props.labelHidden,
            disabled: props.disabled,
            labelClassName: classNames(styles.ChoiceLabel, props.labelClassName),
            fill: props.fill,
            ...extraChoiceProps
        }, {
            label: slots.label?.(),
            helpText: slots.helpText?.(),
            default: () => h('span', {
                class: wrapperClassName
            }, [
                h('input', {
                    ref: inputNode,
                    id: props.id,
                    name: props.name,
                    value: props.value,
                    type: "checkbox",
                    checked: isChecked,
                    disabled: props.disabled,
                    className: inputClassName,
                    onBlur: handleBlur,
                    onChange: noop,
                    onClick: handleOnClick,
                    onFocus: props.onFocus,
                    ariaInvalid: props.error != null,
                    ariaControls: props.ariaControls,
                    ariaDescribedby: ariaDescribedBy,
                    role: isWithinListbox ? 'presentation' : 'checkbox',
                    ...indeterminateAttributes
                }),
                h('span', {
                    class: styles.Backdrop,
                    onClick: stopPropagation,
                    onKeyUp: stopPropagation
                }),
                h('span', {
                    class: classNames(
                        styles.Icon,
                        animatedTickIcon && styles.animated,
                    )
                }, animatedTickIcon ? iconSourceSe23 : h('Icon', { source: iconSource }))
            ])
        });
    }
})
function noop() { }