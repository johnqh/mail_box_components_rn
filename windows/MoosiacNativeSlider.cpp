#include "MoosiacNativeSlider.h"

namespace winrt::MoosiacNativeSlider::implementation {

using winrt::Microsoft::ReactNative::ComponentView;
using winrt::Microsoft::ReactNative::Composition::ComponentViewFeatures;
using winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder;
using winrt::Microsoft::ReactNative::Composition::Input::KeyRoutedEventArgs;
using winrt::Microsoft::ReactNative::Composition::Input::PointerRoutedEventArgs;
using winrt::Microsoft::ReactNative::FocusState;
using winrt::Microsoft::UI::Composition::Visual;
using winrt::Windows::System::VirtualKey;

void RegisterMoosiacNativeSlider(
    const winrt::Microsoft::ReactNative::IReactPackageBuilder &packageBuilder) noexcept {
  MoosiacSliderCodegen::RegisterMoosiacNativeSliderNativeComponent<SliderView>(
      packageBuilder,
      [](const IReactCompositionViewComponentBuilder &builder) {
        // The slider supplies its own track and focusable thumb.
        builder.SetViewFeatures(ComponentViewFeatures::Default &
                                ~ComponentViewFeatures::NativeBorder);
      });
}

Visual SliderView::CreateVisual(const ComponentView &view) noexcept {
  const auto compositor = view.as<winrt::Microsoft::ReactNative::Composition::ComponentView>().Compositor();
  m_root = compositor.CreateSpriteVisual();
  m_root.Brush(compositor.CreateColorBrush({0, 0, 0, 0}));
  m_track = compositor.CreateSpriteVisual();
  m_fill = compositor.CreateSpriteVisual();
  m_thumb = compositor.CreateSpriteVisual();
  m_thumbDetail = compositor.CreateSpriteVisual();
  m_track.Brush(compositor.CreateColorBrush({255, 130, 130, 130}));
  m_fill.Brush(compositor.CreateColorBrush({255, 0, 120, 215}));
  m_thumb.Brush(compositor.CreateColorBrush({255, 0, 120, 215}));
  m_thumbDetail.Brush(compositor.CreateColorBrush({255, 255, 255, 255}));
  m_thumbGeometry = compositor.CreateEllipseGeometry();
  m_detailGeometry = compositor.CreateEllipseGeometry();
  m_thumbClip = compositor.CreateGeometricClip();
  m_thumbClip.Geometry(m_thumbGeometry);
  m_thumb.Clip(m_thumbClip);
  m_detailClip = compositor.CreateGeometricClip();
  m_detailClip.Geometry(m_detailGeometry);
  m_thumbDetail.Clip(m_detailClip);
  m_root.Children().InsertAtTop(m_track);
  m_root.Children().InsertAtTop(m_fill);
  m_root.Children().InsertAtTop(m_thumb);
  m_root.Children().InsertAtTop(m_thumbDetail);
  Draw();
  return m_root;
}

void SliderView::Initialize(const ComponentView &view) noexcept {
  m_pressed = view.PointerPressed(winrt::auto_revoke, [weak = get_weak()](auto const &sender, const PointerRoutedEventArgs &args) {
    if (auto self = weak.get()) {
      if (self->m_disabled || args.GetCurrentPoint(sender.as<ComponentView>().Tag()).Properties().IsRightButtonPressed()) return;
      const auto component = sender.as<ComponentView>();
      self->m_dragging = true;
      self->m_pointerId = args.Pointer().PointerId();
      component.TryFocus(FocusState::Pointer);
      component.as<winrt::Microsoft::ReactNative::Composition::ComponentView>().CapturePointer(args.Pointer());
      self->SetValueAt(args.GetCurrentPoint(component.Tag()).Position().X, false);
      args.Handled(true);
    }
  });
  m_moved = view.PointerMoved(winrt::auto_revoke, [weak = get_weak()](auto const &sender, const PointerRoutedEventArgs &args) {
    if (auto self = weak.get(); self && self->m_dragging && args.Pointer().PointerId() == self->m_pointerId) {
      const auto component = sender.as<ComponentView>();
      self->SetValueAt(args.GetCurrentPoint(component.Tag()).Position().X, false);
      args.Handled(true);
    }
  });
  m_released = view.PointerReleased(winrt::auto_revoke, [weak = get_weak()](auto const &sender, const PointerRoutedEventArgs &args) {
    if (auto self = weak.get(); self && self->m_dragging && args.Pointer().PointerId() == self->m_pointerId) {
      const auto component = sender.as<ComponentView>();
      self->m_dragging = false;
      self->SetValueAt(args.GetCurrentPoint(component.Tag()).Position().X, true);
      component.as<winrt::Microsoft::ReactNative::Composition::ComponentView>().ReleasePointerCapture(args.Pointer());
      args.Handled(true);
    }
  });
  m_captureLost = view.PointerCaptureLost(winrt::auto_revoke, [weak = get_weak()](auto const &, auto const &) {
    if (auto self = weak.get(); self && self->m_dragging) {
      self->m_dragging = false;
      self->SetValue(self->m_value, true);
    }
  });
  m_keyDown = view.KeyDown(winrt::auto_revoke, [weak = get_weak()](auto const &, const KeyRoutedEventArgs &args) {
    if (auto self = weak.get()) self->OnKeyDown(args);
  });
}

void SliderView::UpdateProps(
    const ComponentView &view,
    const winrt::com_ptr<MoosiacSliderCodegen::MoosiacNativeSliderProps> &newProps,
    const winrt::com_ptr<MoosiacSliderCodegen::MoosiacNativeSliderProps> &oldProps) noexcept {
  MoosiacSliderCodegen::BaseMoosiacNativeSlider<SliderView>::UpdateProps(view, newProps, oldProps);
  if (!newProps) return;
  m_min = newProps->minimumValue.value_or(0);
  m_max = std::max(m_min, newProps->maximumValue.value_or(1));
  m_step = std::max(0.0, newProps->step.value_or(0));
  m_disabled = newProps->disabled.value_or(false);
  m_faderThumb = newProps->faderThumb.value_or(false);
  if (!m_dragging) {
    const double requested = newProps->value.value_or(m_min);
    m_value = std::isfinite(requested) ? std::clamp(requested, m_min, m_max) : m_min;
  }
  if (m_root) {
    const auto theme = view.as<winrt::Microsoft::ReactNative::Composition::ComponentView>().Theme();
    if (newProps->trackColor) {
      m_track.Brush(m_root.Compositor().CreateColorBrush(newProps->trackColor.AsWindowsColor(theme)));
    }
    if (newProps->trackFillColor) {
      const auto accent = newProps->trackFillColor.AsWindowsColor(theme);
      m_fill.Brush(m_root.Compositor().CreateColorBrush(accent));
      m_thumb.Brush(m_root.Compositor().CreateColorBrush(accent));
    }
  }
  Draw();
}

void SliderView::UpdateLayoutMetrics(
    const ComponentView &,
    const winrt::Microsoft::ReactNative::LayoutMetrics &newMetrics,
    const winrt::Microsoft::ReactNative::LayoutMetrics &) noexcept {
  m_width = std::max(0.0f, newMetrics.Frame.Width);
  m_height = std::max(0.0f, newMetrics.Frame.Height);
  m_scale = std::max(0.01f, newMetrics.PointScaleFactor);
  m_left = newMetrics.Frame.X;
  m_top = newMetrics.Frame.Y;
  if (m_root) {
    m_root.Offset({newMetrics.Frame.X * m_scale, newMetrics.Frame.Y * m_scale, 0});
  }
  Draw();
}

void SliderView::Draw() noexcept {
  if (!m_root) return;
  const float thumbWidth = m_faderThumb ? 10.0f : 16.0f;
  const float thumbHeight = m_faderThumb ? 18.0f : 16.0f;
  const float travel = std::max(0.0f, m_width - thumbWidth);
  const float fraction = m_max > m_min ? static_cast<float>((m_value - m_min) / (m_max - m_min)) : 0.0f;
  const float thumbX = std::clamp(fraction, 0.0f, 1.0f) * travel;
  const float centerY = m_height / 2.0f;
  const float trackStart = thumbWidth / 2.0f;
  const float trackWidth = travel;
  const float trackHeight = 4.0f;
  m_root.Size({m_width * m_scale, m_height * m_scale});
  m_root.Offset({m_left * m_scale, m_top * m_scale, 0});
  m_root.Opacity(m_disabled ? 0.45f : 1.0f);
  m_track.Offset({trackStart * m_scale, (centerY - trackHeight / 2) * m_scale, 0});
  m_track.Size({trackWidth * m_scale, trackHeight * m_scale});
  m_fill.Offset({trackStart * m_scale, (centerY - trackHeight / 2) * m_scale, 0});
  m_fill.Size({thumbX * m_scale, trackHeight * m_scale});
  m_thumb.Offset({thumbX * m_scale, (centerY - thumbHeight / 2) * m_scale, 0});
  m_thumb.Size({thumbWidth * m_scale, thumbHeight * m_scale});
  if (m_faderThumb) {
    m_thumb.Clip(nullptr);
    m_thumbDetail.Clip(nullptr);
    m_thumbDetail.Offset({(thumbX + 2) * m_scale, (centerY - 1) * m_scale, 0});
    m_thumbDetail.Size({6 * m_scale, 2 * m_scale});
  } else {
    m_thumbGeometry.Center({thumbWidth * m_scale / 2, thumbHeight * m_scale / 2});
    m_thumbGeometry.Radius({thumbWidth * m_scale / 2, thumbHeight * m_scale / 2});
    m_thumb.Clip(m_thumbClip);
    m_detailGeometry.Center({5 * m_scale, 5 * m_scale});
    m_detailGeometry.Radius({5 * m_scale, 5 * m_scale});
    m_thumbDetail.Clip(m_detailClip);
    m_thumbDetail.Offset({(thumbX + 3) * m_scale, (centerY - 5) * m_scale, 0});
    m_thumbDetail.Size({10 * m_scale, 10 * m_scale});
  }
}

void SliderView::SetValue(double value, bool complete) noexcept {
  if (!std::isfinite(value)) return;
  const double clamped = std::clamp(value, m_min, m_max);
  const double snapped = m_step > 0 ? std::clamp(m_min + std::round((clamped - m_min) / m_step) * m_step, m_min, m_max) : clamped;
  if (snapped != m_value) {
    m_value = snapped;
    Draw();
    if (auto emitter = EventEmitter()) {
      emitter->onValueChange({snapped});
    }
  }
  if (complete) {
    if (auto emitter = EventEmitter()) emitter->onSlidingComplete({m_value});
  }
}

void SliderView::SetValueAt(float x, bool complete) noexcept {
  const float thumbWidth = m_faderThumb ? 10.0f : 16.0f;
  const float travel = std::max(1.0f, m_width - thumbWidth);
  const float fraction = std::clamp((x - thumbWidth / 2.0f) / travel, 0.0f, 1.0f);
  SetValue(m_min + fraction * (m_max - m_min), complete);
}

void SliderView::OnKeyDown(const KeyRoutedEventArgs &args) noexcept {
  if (m_disabled) return;
  const double increment = m_step > 0 ? m_step : (m_max - m_min) / 100.0;
  double next = m_value;
  switch (args.Key()) {
    case VirtualKey::Left:
    case VirtualKey::Down: next -= increment; break;
    case VirtualKey::Right:
    case VirtualKey::Up: next += increment; break;
    case VirtualKey::PageDown: next -= increment * 10; break;
    case VirtualKey::PageUp: next += increment * 10; break;
    case VirtualKey::Home: next = m_min; break;
    case VirtualKey::End: next = m_max; break;
    default: return;
  }
  SetValue(next, true);
  args.Handled(true);
}

} // namespace winrt::MoosiacNativeSlider::implementation
