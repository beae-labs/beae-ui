import { defineComponent, h, defineProps } from "vue"

import {
    getResponsiveProps,
    getResponsiveValue,
    classNames,
    sanitizeCustomProperties,
} from '../../utilities/css';
import type { ResponsiveProp } from '../../utilities/css';
import type { Error } from '../../types';
import { InlineError } from '../InlineError';
import { Text } from '../Text';
import { useFeatures } from '../../utilities/features';

//   import styles from './Choice.scss';

type Spacing = ResponsiveProp<SpaceScale>;

export interface ChoiceBleedProps {
    /** Spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleed='4'
     * bleed={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleed?: Spacing;
    /** Vertical start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedBlockStart='4'
     * bleedBlockStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedBlockStart?: Spacing;
    /** Vertical end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedBlockEnd='4'
     * bleedBlockEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedBlockEnd?: Spacing;
    /** Horizontal start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedInlineStart='4'
     * bleedInlineStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedInlineStart?: Spacing;
    /** Horizontal end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedInlineEnd='4'
     * bleedInlineEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedInlineEnd?: Spacing;
}

interface ChoiceProps extends ChoiceBleedProps {
    /** A unique identifier for the choice */
    id: string;
    /**	Label for the choice */
    // label: HTMLElement; use slot label
    /** Whether the associated form control is disabled */
    disabled?: boolean;
    /** Visually hide the label */
    labelHidden?: boolean;
    /**  Content to display inside the choice */
    // children?: HTMLElement; use slot children
    /** Callback when clicked */
    onClick?(): void;
    /** Added to the label element */
    labelClassName?: string;
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill?: boolean;
    /** Display an error message */
    error?: Error | boolean;
    /** Additional text to aide in use. Will add a wrapping <div> */
    // helpText?: HTMLElement; use slot helpText
}

const props = defineProps<ChoiceProps>();
export const Button = defineComponent({
    props,
    setup(_, { slots, props }) {
        const { polarisSummerEditions2023 } = useFeatures();
        const className = classNames(
            styles.Choice,
            props.labelHidden && styles.labelHidden,
            props.disabled && styles.disabled,
            props.labelClassName,
        );

        const labelStyle = {
            // Pass through overrides for bleed values if they're set by the prop
            ...getResponsiveProps(
                'choice',
                'bleed-block-end',
                'space',
                props.bleedBlockEnd || props.bleed,
            ),
            ...getResponsiveProps(
                'choice',
                'bleed-block-start',
                'space',
                props.bleedBlockStart || props.bleed,
            ),
            ...getResponsiveProps(
                'choice',
                'bleed-inline-start',
                'space',
                props.bleedInlineStart || props.bleed,
            ),
            ...getResponsiveProps(
                'choice',
                'bleed-inline-end',
                'space',
                props.bleedInlineEnd || props.bleed,
            ),
            ...Object.fromEntries(
                Object.entries(getResponsiveValue('choice', 'fill', props.fill)).map(
                    // Map "true" => "100%" and "false" => "auto" for use in
                    // inline/block-size calc()
                    ([key, value]) => [key, value ? '100%' : 'auto'],
                ),
            ),
        } as any;
        const labelMarkup = h('label', {
            class: className,
            for: props.id,
            onClick: props.onClick,
            style: sanitizeCustomProperties(labelStyle)
        }, [
            h('span', { class: styles.Control }, slots.children?.()),
            h('span', { class: styles.Label }, h('span', slots.label?.()))
        ]);

        const helpTextMarkup = helpText ?
            h('div', {
                class: styles.HelpText,
                id: helpTextID(props.id)
            },
            // TODO: gọi component Text
                h('Texy', {
                    // `undefined` means color: inherit
                    // the nearest ancestor with a specified color is .Descriptions in Choice.scss
                    color: props.disabled && polarisSummerEditions2023 ? undefined : 'subdued'
                }, slots.helpText?.())) : null;

        const errorMarkup = props.error && typeof props.error !== 'boolean' &&
            h('div', { class: styles.Error }, h('InlineError', {
                message: props.error, fieldID: props.id
            }));

        const descriptionMarkup =
            helpTextMarkup || errorMarkup ?
                h('div', {
                    class: styles.Descriptions
                }, [errorMarkup, helpTextMarkup]) : null;

        return descriptionMarkup ? h('div', [labelMarkup, descriptionMarkup]) : labelMarkup;
    }
})

export function helpTextID(id: string) {
    return `${id}HelpText`;
}