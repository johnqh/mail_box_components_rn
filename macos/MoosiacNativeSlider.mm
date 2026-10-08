#import <TargetConditionals.h>

#if TARGET_OS_OSX
#import <AppKit/AppKit.h>
#import <React/RCTConvert.h>
#define SliderMinimum(slider) [(slider) minValue]
#define SliderMaximum(slider) [(slider) maxValue]
#define SliderCurrent(slider) [(slider) doubleValue]
#define SliderSetMinimum(slider, value) [(slider) setMinValue:(value)]
#define SliderSetMaximum(slider, value) [(slider) setMaxValue:(value)]
#define SliderSetCurrent(slider, value) [(slider) setDoubleValue:(value)]
#else
#import <UIKit/UIKit.h>
#define SliderMinimum(slider) [(slider) minimumValue]
#define SliderMaximum(slider) [(slider) maximumValue]
#define SliderCurrent(slider) [(slider) value]
#define SliderSetMinimum(slider, value) [(slider) setMinimumValue:(float)(value)]
#define SliderSetMaximum(slider, value) [(slider) setMaximumValue:(float)(value)]
#define SliderSetCurrent(slider, value) [(slider) setValue:(float)(value) animated:NO]
#endif

#if TARGET_OS_OSX || TARGET_OS_IOS
#import <React/RCTComponent.h>
#import <React/RCTViewManager.h>

#if TARGET_OS_OSX
@interface MoosiacNativeSliderCell : NSSliderCell
@property (nonatomic, assign) BOOL faderThumb;
@end

@implementation MoosiacNativeSliderCell

- (void)drawKnob:(NSRect)knobRect
{
  if (!self.faderThumb) {
    [super drawKnob:knobRect];
    return;
  }

  // Keep the system track and interaction; only the pan handle becomes a fader.
  NSRect handle = NSMakeRect(NSMidX(knobRect) - 4, NSMidY(knobRect) - 8, 8, 16);
  NSBezierPath *path = [NSBezierPath bezierPathWithRoundedRect:handle xRadius:2 yRadius:2];
  [NSGraphicsContext saveGraphicsState];
  NSShadow *shadow = [NSShadow new];
  shadow.shadowColor = [[NSColor blackColor] colorWithAlphaComponent:0.25];
  shadow.shadowBlurRadius = 3;
  shadow.shadowOffset = NSMakeSize(0, -1);
  [shadow set];
  [[NSColor controlBackgroundColor] setFill];
  [path fill];
  [NSGraphicsContext restoreGraphicsState];
  [[NSColor separatorColor] setStroke];
  path.lineWidth = 0.5;
  [path stroke];
}

@end

@interface MoosiacNativeSliderControl : NSSlider
#else
@interface MoosiacNativeSliderControl : UISlider
#endif
@property (nonatomic, copy) dispatch_block_t onInteractionComplete;
@property (nonatomic, assign) double stepValue;
#if TARGET_OS_OSX
@property (nonatomic, assign) BOOL faderThumb;
#endif
@property (nonatomic, copy) RCTBubblingEventBlock onValueChange;
@property (nonatomic, copy) RCTBubblingEventBlock onSlidingComplete;
@end

@implementation MoosiacNativeSliderControl

#if TARGET_OS_OSX
+ (Class)cellClass
{
  return [MoosiacNativeSliderCell class];
}

- (void)setFaderThumb:(BOOL)faderThumb
{
  ((MoosiacNativeSliderCell *)self.cell).faderThumb = faderThumb;
  [self setNeedsDisplay:YES];
}
#endif

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    self.stepValue = 0;
#if TARGET_OS_OSX
    self.continuous = YES;
#endif
  }
  return self;
}

#if TARGET_OS_OSX
- (void)mouseDown:(NSEvent *)event
{
  [super mouseDown:event];
  if (self.onInteractionComplete) {
    self.onInteractionComplete();
  }
}
#else
- (void)finishTouch
{
  if (self.onInteractionComplete) {
    self.onInteractionComplete();
  }
  if (self.onSlidingComplete) {
    self.onSlidingComplete(@{ @"value": @(SliderCurrent(self)) });
  }
}
#endif

#if TARGET_OS_OSX
- (void)keyUp:(NSEvent *)event
{
  [super keyUp:event];
  if (self.onInteractionComplete) {
    self.onInteractionComplete();
  }
}
#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED

#if TARGET_OS_OSX
#import <React/RCTConversions.h>
#endif
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/MoosiacNativeSliderSpec/ComponentDescriptors.h>
#import <react/renderer/components/MoosiacNativeSliderSpec/EventEmitters.h>
#import <react/renderer/components/MoosiacNativeSliderSpec/Props.h>
#import <react/renderer/components/MoosiacNativeSliderSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface MoosiacNativeSliderComponentView : RCTViewComponentView <RCTMoosiacNativeSliderViewProtocol>
@end

@implementation MoosiacNativeSliderComponentView {
  MoosiacNativeSliderControl *_slider;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<MoosiacNativeSliderComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MoosiacNativeSliderProps>();
    _props = defaultProps;

    _slider = [[MoosiacNativeSliderControl alloc] initWithFrame:self.bounds];
    SliderSetMinimum(_slider, defaultProps->minimumValue);
    SliderSetMaximum(_slider, defaultProps->maximumValue);
    SliderSetCurrent(_slider, defaultProps->value);
#if TARGET_OS_OSX
    _slider.target = self;
    _slider.action = @selector(sliderValueChanged:);
    _slider.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
#else
    [_slider addTarget:self action:@selector(sliderValueChanged:) forControlEvents:UIControlEventValueChanged];
    [_slider addTarget:self action:@selector(sliderInteractionCompleted) forControlEvents:UIControlEventTouchUpInside | UIControlEventTouchUpOutside | UIControlEventTouchCancel];
#endif

    __weak MoosiacNativeSliderComponentView *weakSelf = self;
#if TARGET_OS_OSX
    _slider.onInteractionComplete = ^{ [weakSelf sliderInteractionCompleted]; };
#endif
    self.contentView = _slider;
  }
  return self;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  [super updateProps:props oldProps:oldProps];
  const auto &newProps = *std::static_pointer_cast<const MoosiacNativeSliderProps>(props);

  SliderSetMinimum(_slider, newProps.minimumValue);
  SliderSetMaximum(_slider, MAX(newProps.minimumValue, newProps.maximumValue));
  _slider.stepValue = newProps.step;
  _slider.enabled = !newProps.disabled;
#if TARGET_OS_OSX
  _slider.trackFillColor = RCTUIColorFromSharedColor(newProps.trackFillColor);
  _slider.faderThumb = newProps.faderThumb;
#endif
  SliderSetCurrent(_slider, MIN(SliderMaximum(_slider), MAX(SliderMinimum(_slider), newProps.value)));
}

- (void)sliderValueChanged:(id)sender
{
  double value = SliderCurrent(_slider);
  if (_slider.stepValue > 0) {
    value = SliderMinimum(_slider) + round((value - SliderMinimum(_slider)) / _slider.stepValue) * _slider.stepValue;
    value = MIN(SliderMaximum(_slider), MAX(SliderMinimum(_slider), value));
    SliderSetCurrent(_slider, value);
  }

  auto emitter = std::dynamic_pointer_cast<const MoosiacNativeSliderEventEmitter>(_eventEmitter);
  if (emitter) {
    emitter->onValueChange(MoosiacNativeSliderEventEmitter::OnValueChange{.value = value});
  }
}

- (void)sliderInteractionCompleted
{
  auto emitter = std::dynamic_pointer_cast<const MoosiacNativeSliderEventEmitter>(_eventEmitter);
  if (emitter) {
    emitter->onSlidingComplete(MoosiacNativeSliderEventEmitter::OnSlidingComplete{.value = SliderCurrent(_slider)});
  }
}

#if TARGET_OS_OSX
- (NSView *)accessibilityElement
{
  return _slider;
}
#endif

@end

#else

@interface MoosiacNativeSliderManager : RCTViewManager
@end

@implementation MoosiacNativeSliderManager

RCT_EXPORT_MODULE(MoosiacNativeSlider)

#if TARGET_OS_OSX
- (NSView *)view
#else
- (UIView *)view
#endif
{
  MoosiacNativeSliderControl *slider = [[MoosiacNativeSliderControl alloc] initWithFrame:NSZeroRect];
#if TARGET_OS_OSX
  slider.target = self;
  slider.action = @selector(sliderValueChanged:);
  __weak MoosiacNativeSliderControl *weakSlider = slider;
  slider.onInteractionComplete = ^{
    MoosiacNativeSliderControl *strongSlider = weakSlider;
    if (strongSlider.onSlidingComplete) {
      strongSlider.onSlidingComplete(@{ @"value": @(SliderCurrent(strongSlider)) });
    }
  };
#else
  [slider addTarget:self action:@selector(sliderValueChanged:) forControlEvents:UIControlEventValueChanged];
  [slider addTarget:slider action:@selector(finishTouch) forControlEvents:UIControlEventTouchUpInside | UIControlEventTouchUpOutside | UIControlEventTouchCancel];
#endif
  return slider;
}

- (void)sliderValueChanged:(MoosiacNativeSliderControl *)slider
{
  if (slider.stepValue > 0) {
    double value = SliderMinimum(slider) + round((SliderCurrent(slider) - SliderMinimum(slider)) / slider.stepValue) * slider.stepValue;
    SliderSetCurrent(slider, MIN(SliderMaximum(slider), MAX(SliderMinimum(slider), value)));
  }
  if (slider.onValueChange) {
    slider.onValueChange(@{ @"value": @(SliderCurrent(slider)) });
  }
}

RCT_EXPORT_VIEW_PROPERTY(onValueChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSlidingComplete, RCTBubblingEventBlock)
RCT_CUSTOM_VIEW_PROPERTY(minimumValue, NSNumber, MoosiacNativeSliderControl)
{
  SliderSetMinimum(view, json ? [RCTConvert double:json] : 0);
  SliderSetCurrent(view, fmax(SliderMinimum(view), SliderCurrent(view)));
}
RCT_CUSTOM_VIEW_PROPERTY(maximumValue, NSNumber, MoosiacNativeSliderControl)
{
  SliderSetMaximum(view, json ? [RCTConvert double:json] : 1);
  SliderSetCurrent(view, fmin(SliderMaximum(view), SliderCurrent(view)));
}
RCT_CUSTOM_VIEW_PROPERTY(value, NSNumber, MoosiacNativeSliderControl)
{
  double value = json ? [RCTConvert double:json] : SliderCurrent(defaultView);
  SliderSetCurrent(view, fmin(SliderMaximum(view), fmax(SliderMinimum(view), value)));
}
RCT_CUSTOM_VIEW_PROPERTY(step, NSNumber, MoosiacNativeSliderControl)
{
  view.stepValue = json ? [RCTConvert double:json] : 0;
}
RCT_CUSTOM_VIEW_PROPERTY(disabled, BOOL, MoosiacNativeSliderControl)
{
  view.enabled = json ? ![RCTConvert BOOL:json] : YES;
}
#if TARGET_OS_OSX
RCT_CUSTOM_VIEW_PROPERTY(trackFillColor, NSColor, MoosiacNativeSliderControl)
{
  view.trackFillColor = json ? [RCTConvert NSColor:json] : nil;
}
RCT_CUSTOM_VIEW_PROPERTY(faderThumb, BOOL, MoosiacNativeSliderControl)
{
  view.faderThumb = json ? [RCTConvert BOOL:json] : NO;
}
#endif

@end

#endif
#endif
