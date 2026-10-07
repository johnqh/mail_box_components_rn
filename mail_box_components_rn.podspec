require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'mail_box_components_rn'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/sudobility/components-rn'
  s.license      = package['license']
  s.author       = 'Sudobility'
  s.source       = { :git => 'https://github.com/johnqh/mail_box_components_rn.git', :tag => s.version }

  s.ios.deployment_target = '13.0'
  s.osx.deployment_target = '10.13'

  # The source is guarded by TARGET_OS_OSX; iOS consumes the separate
  # @react-native-community/slider native implementation.
  s.ios.source_files = 'macos/**/*.{h,m,mm}'
  s.osx.source_files = 'macos/**/*.{h,m,mm}'
  s.osx.frameworks = 'AppKit'

  if defined?(install_modules_dependencies)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
    if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
      s.dependency 'React-RCTFabric'
      s.dependency 'React-Codegen'
      s.dependency 'RCT-Folly'
      s.dependency 'RCTRequired'
      s.dependency 'RCTTypeSafety'
      s.dependency 'ReactCommon/turbomodule/core'
    end
  end
end
