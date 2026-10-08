#pragma once

#include <algorithm>
#include <cmath>

#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.ReactNative.Composition.Input.h>
#include <winrt/Microsoft.UI.Composition.h>
#include <winrt/Windows.System.h>

#include "codegen/react/components/MoosiacNativeSliderSpec/MoosiacNativeSlider.g.h"

namespace winrt::MoosiacNativeSlider::implementation {

// Register this view from the host's IReactPackageProvider. The view is a
// Fabric Composition component; the package's older XAML slider cannot be
// mounted by a React Native Windows Composition host.
void RegisterMoosiacNativeSlider(
    const winrt::Microsoft::ReactNative::IReactPackageBuilder &packageBuilder) noexcept;

struct SliderView : winrt::implements<SliderView, winrt::IInspectable>,
                    MoosiacSliderCodegen::BaseMoosiacNativeSlider<SliderView> {
  winrt::Microsoft::UI::Composition::Visual CreateVisual(
      const winrt::Microsoft::ReactNative::ComponentView &view) noexcept override;
  void Initialize(const winrt::Microsoft::ReactNative::ComponentView &view) noexcept override;
  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::com_ptr<MoosiacSliderCodegen::MoosiacNativeSliderProps> &newProps,
      const winrt::com_ptr<MoosiacSliderCodegen::MoosiacNativeSliderProps> &oldProps) noexcept override;
  void UpdateLayoutMetrics(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::LayoutMetrics &newMetrics,
      const winrt::Microsoft::ReactNative::LayoutMetrics &oldMetrics) noexcept override;

 private:
  void Draw() noexcept;
  void SetValue(double value, bool complete) noexcept;
  void SetValueAt(float x, bool complete) noexcept;
  void OnKeyDown(const winrt::Microsoft::ReactNative::Composition::Input::KeyRoutedEventArgs &args) noexcept;

  winrt::Microsoft::UI::Composition::SpriteVisual m_root{nullptr};
  winrt::Microsoft::UI::Composition::SpriteVisual m_track{nullptr};
  winrt::Microsoft::UI::Composition::SpriteVisual m_fill{nullptr};
  winrt::Microsoft::UI::Composition::SpriteVisual m_thumb{nullptr};
  winrt::Microsoft::UI::Composition::SpriteVisual m_thumbDetail{nullptr};
  winrt::Microsoft::UI::Composition::CompositionEllipseGeometry m_thumbGeometry{nullptr};
  winrt::Microsoft::UI::Composition::CompositionEllipseGeometry m_detailGeometry{nullptr};
  winrt::Microsoft::UI::Composition::CompositionGeometricClip m_thumbClip{nullptr};
  winrt::Microsoft::UI::Composition::CompositionGeometricClip m_detailClip{nullptr};

  winrt::Microsoft::ReactNative::ComponentView::PointerPressed_revoker m_pressed;
  winrt::Microsoft::ReactNative::ComponentView::PointerMoved_revoker m_moved;
  winrt::Microsoft::ReactNative::ComponentView::PointerReleased_revoker m_released;
  winrt::Microsoft::ReactNative::ComponentView::PointerCaptureLost_revoker m_captureLost;
  winrt::Microsoft::ReactNative::ComponentView::KeyDown_revoker m_keyDown;

  double m_min = 0;
  double m_max = 1;
  double m_value = 0;
  double m_step = 0;
  float m_width = 0;
  float m_height = 24;
  float m_scale = 1;
  float m_left = 0;
  float m_top = 0;
  bool m_disabled = false;
  bool m_faderThumb = false;
  bool m_dragging = false;
  uint32_t m_pointerId = 0;
};

} // namespace winrt::MoosiacNativeSlider::implementation
