import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  BubblingEventHandler,
  Double,
  DirectEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { HostComponent, ViewProps } from 'react-native';

type SliderValueEvent = Readonly<{ value: Double }>;

export interface NativeProps extends ViewProps {
  minimumValue?: Double;
  maximumValue?: Double;
  value?: Double;
  step?: Double;
  disabled?: WithDefault<boolean, false>;
  onValueChange?: BubblingEventHandler<SliderValueEvent>;
  onSlidingComplete?: DirectEventHandler<SliderValueEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'MoosiacNativeSlider'
) as HostComponent<NativeProps>;
