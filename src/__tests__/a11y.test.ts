import { accessibilityTap, pressProps } from '../lib/a11y';

describe('accessibilityTap', () => {
  it('calls the press handler', () => {
    const onPress = jest.fn();
    accessibilityTap(onPress)?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is undefined when there is nothing to call', () => {
    expect(accessibilityTap(undefined)).toBeUndefined();
    expect(accessibilityTap(null)).toBeUndefined();
  });

  it('is undefined when disabled, so the control stays inert', () => {
    expect(accessibilityTap(jest.fn(), true)).toBeUndefined();
  });

  it('passes no event, because there is no gesture behind the activation', () => {
    const onPress = jest.fn();
    accessibilityTap(onPress)?.();
    expect(onPress).toHaveBeenCalledWith(undefined);
  });
});

describe('pressProps', () => {
  it('hands back both activation routes for one handler', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress);
    expect(props.onPress).toBe(onPress);
    props.onAccessibilityTap?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps onPress but drops the tap when disabled', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress, true);
    // `disabled` on the touchable is what suppresses `onPress`; nothing
    // suppresses `onAccessibilityTap` for you, so it has to be withheld here.
    expect(props.onPress).toBe(onPress);
    expect(props.onAccessibilityTap).toBeUndefined();
  });

  it('normalises a missing handler to undefined', () => {
    expect(pressProps(null)).toEqual({
      onPress: undefined,
      onAccessibilityTap: undefined,
    });
  });
});
