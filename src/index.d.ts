import {TVConfig} from "./config";
import {ClassValue, ClassProp, OmitUndefined, StringToBoolean} from "./utils";

type TVBaseName = "base";

type TVScreens = "initial" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type TVSlots = Record<string, ClassValue> | undefined;

type TVSlotsWithBase<S extends TVSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | TVBaseName;

type SlotsClassValue<S extends TVSlots, B extends ClassValue> = {
  [K in TVSlotsWithBase<S, B>]?: ClassValue;
};

export type TVVariants<S extends TVSlots, B extends ClassValue> = {
  [key: string]: {
    [key: string]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue;
  };
};

export type TVCompoundVariants<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V]?: StringToBoolean<keyof V[K]> | StringToBoolean<keyof V[K]>[];
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
>;

export type TVDefaultVariants<V extends TVVariants<S>, S extends TVSlots> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>;
};

export type TVScreenPropsValue<V extends TVVariants<S>, K extends keyof V> = {
  [K2 in TVScreens]?: StringToBoolean<keyof V[K]>;
};

export type TVProps<V extends TVVariants<S>, S extends TVSlots> = V extends undefined
  ? ClassProp<ClassValue>
  : {
      [K in keyof V]?: StringToBoolean<keyof V[K]> | TVScreenPropsValue<V, K>;
    } & ClassProp<ClassValue>;

export type TVVariantKeys<V extends TVVariants<S>, S extends TVSlots> = V extends Object
  ? Array<keyof V>
  : undefined;

export type TVReturnProps<V extends TVVariants<S>, S extends TVSlots, B extends ClassValue> = {
  base: B;
  variantkeys: TVVariantKeys<V, S>;
};

export type TVReturnType<V extends TVVariants<S>, S extends TVSlots, B extends ClassValue> = {
  (props?: TVProps<V, S>): S extends undefined
    ? string
    : {[K in TVSlotsWithBase<S, B>]: (slotProps?: ClassProp) => string};
} & TVReturnProps<V, S, B>;

export type TV = {
  <
    V extends TVVariants<S> = undefined,
    CV extends TVCompoundVariants<V, S, B> = undefined,
    DV extends TVDefaultVariants<V, S> = undefined,
    C extends TVConfig,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
  >(
    options: {
      // TODO: this should be typed and the variants should be inherited
      extend?: any;
      base?: B;
      slots?: S;
      variants?: V;
      compoundVariants?: CV;
      defaultVariants?: DV;
    },
    config?: C,
  ): TVReturnType<V, S, B>;
};

export declare const tv: TV;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;
