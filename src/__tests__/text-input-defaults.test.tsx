/**
 * Android's fullscreen extract mode is off on every text field in this package.
 *
 * When a phone is short of vertical room — which in practice means landscape,
 * on every phone — Android may stop editing the field in place and replace the
 * whole app with a full-screen text editor and a DONE button. For a login form
 * that is defensible. For anything whose design is that you watch something
 * while you type it, it destroys the feature: a lyric-entry bar exists to keep
 * the note you are writing a syllable onto visible, and extract mode covers the
 * score with a text box.
 *
 * `disableFullscreenUI` is React Native's name for Android's `flagNoExtractUi`.
 * It needs **no platform branch**, in the code or in the types: it is declared
 * on the shared `TextInputProps` and forwarded to the native view only from
 * `TextInput`'s Android branch, so on iOS, macOS and Windows it is a prop
 * nothing reads. That claim is checked against React Native's own source below
 * rather than taken on trust, because "inert elsewhere" is the sort of thing
 * that is true until a version bump.
 *
 * **What this can see.** jsdom runs no Android, so nothing here proves the IME
 * behaves. What it pins is the prop reaching every `TextInput` this package
 * renders — which is where the defect was, since the prop was simply absent.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TextInput, View } from 'react-native';

import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { NumberInput } from '../ui/NumberInput';
import { SearchInput } from '../ui/SearchInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Combobox } from '../ui/Combobox';
import { MultiSelect } from '../ui/MultiSelect';
import { TransferList } from '../ui/TransferList';
import { Command } from '../ui/Command';
import { TextInputModal } from '../ui/TextInputModal';
import { textInputDefaults } from '../lib/text-input';

/** Every `TextInput` a render produced, as host nodes. */
function inputsIn(view: {
  UNSAFE_getAllByType: (t: unknown) => { props: Record<string, unknown> }[];
}) {
  return view.UNSAFE_getAllByType(TextInput);
}

describe('textInputDefaults', () => {
  it('turns Android fullscreen extract mode off', () => {
    expect(textInputDefaults).toEqual({ disableFullscreenUI: true });
  });

  it('is inert off Android, so no platform branch is needed', () => {
    /*
      Verified rather than assumed. Two facts make the claim true, and both are
      readable in React Native's own source:

      1. the prop is declared on the *shared* props type, not an Android-only
         one — so TypeScript accepts it on every platform;
      2. it is forwarded to a native view exactly once, inside the
         `<AndroidTextInput>` branch — so no other platform ever receives it.
    */
    const rn = path.dirname(require.resolve('react-native/package.json'));
    const dts = fs.readFileSync(
      path.join(rn, 'Libraries/Components/TextInput/TextInput.d.ts'),
      'utf8'
    );
    expect(dts).toMatch(/disableFullscreenUI\?: boolean \| undefined;/);

    const source = fs.readFileSync(
      path.join(rn, 'Libraries/Components/TextInput/TextInput.js'),
      'utf8'
    );
    const forwards = source.match(/disableFullscreenUI=\{/g) ?? [];
    expect(forwards).toHaveLength(1);
    // The one forward sits after `<AndroidTextInput` and before that element
    // closes — i.e. it is the Android branch and nothing else.
    const android = source.indexOf('<AndroidTextInput');
    expect(android).toBeGreaterThan(-1);
    expect(source.indexOf('disableFullscreenUI={')).toBeGreaterThan(android);
  });
});

describe('every text field in the package disables extract mode', () => {
  it('Input', () => {
    const view = render(<Input placeholder='Email' />);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it('TextArea', () => {
    const view = render(<TextArea value='' onChangeText={jest.fn()} />);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it.each(['right', 'sides'] as const)(
    'NumberInput with steppers on the %s',
    position => {
      const view = render(
        <NumberInput
          value={1}
          onChange={jest.fn()}
          showSteppers
          stepperPosition={position}
        />
      );
      expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
    }
  );

  it('NumberInput with no steppers', () => {
    const view = render(<NumberInput value={1} onChange={jest.fn()} />);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it('SearchInput', () => {
    const view = render(<SearchInput value='' onChangeText={jest.fn()} />);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it('PhoneInput — the number field and the country search alike', () => {
    const view = render(<PhoneInput value='' onChange={jest.fn()} />);
    const { fireEvent } = require('@testing-library/react-native');
    // Open the country picker so its search field mounts too.
    fireEvent.press(screen.getAllByRole('button')[0]!);
    const inputs = inputsIn(view);
    expect(inputs.length).toBeGreaterThan(1);
    for (const input of inputs) {
      expect(input.props.disableFullscreenUI).toBe(true);
    }
  });

  it('TextInputModal', () => {
    const view = render(
      <TextInputModal
        isOpen
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        title='Name'
        description='Give it a name'
      />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it("Combobox's search field", () => {
    const view = render(
      <Combobox
        value='a'
        onValueChange={jest.fn()}
        options={[{ label: 'A', value: 'a' }]}
      />
    );
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(screen.getAllByRole('button')[0]!);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it("MultiSelect's search field", () => {
    const view = render(
      <MultiSelect
        value={[]}
        onValueChange={jest.fn()}
        options={[{ label: 'A', value: 'a' }]}
        searchable
      />
    );
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(screen.getAllByRole('button')[0]!);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });

  it("TransferList's search fields", () => {
    const view = render(
      <TransferList
        source={[{ id: 'a', label: 'A' }]}
        target={[{ id: 'b', label: 'B' }]}
        onChange={jest.fn()}
        searchable
      />
    );
    const inputs = inputsIn(view);
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      expect(input.props.disableFullscreenUI).toBe(true);
    }
  });

  it("Command's search field", () => {
    const view = render(
      <Command
        isOpen
        onClose={jest.fn()}
        items={[{ id: 'a', label: 'A', onSelect: jest.fn() }]}
      />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(true);
  });
});

describe('the default is a default, not a hardcoded value', () => {
  it('a caller of Input can ask for the platform editor back', () => {
    // It reaches `TextInput` through the props spread, and the spread is after
    // the defaults — which is the whole reason the order matters.
    const view = render(<Input placeholder='E' disableFullscreenUI={false} />);
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });

  it('a caller of TextArea can too', () => {
    const view = render(
      <TextArea value='' onChangeText={jest.fn()} disableFullscreenUI={false} />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });

  it('a caller of SearchInput can too', () => {
    const view = render(
      <SearchInput
        value=''
        onChangeText={jest.fn()}
        disableFullscreenUI={false}
      />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });

  it('NumberInput takes an explicit prop, since it has no props spread', () => {
    const view = render(
      <NumberInput value={1} onChange={jest.fn()} disableFullscreenUI={false} />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });

  it('PhoneInput takes one too', () => {
    const view = render(
      <PhoneInput value='' onChange={jest.fn()} disableFullscreenUI={false} />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });

  it('TextInputModal takes one too', () => {
    const view = render(
      <TextInputModal
        isOpen
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        title='Name'
        description='d'
        disableFullscreenUI={false}
      />
    );
    expect(inputsIn(view)[0]!.props.disableFullscreenUI).toBe(false);
  });
});

/**
 * The guard the per-component tests cannot be: a `TextInput` added tomorrow.
 *
 * Twelve assertions above name twelve call sites, and a thirteenth written next
 * month passes all of them by not being mentioned. This reads the source
 * instead, so a new field is caught by existing code rather than by somebody
 * remembering to add a case.
 */
describe('no text input in the package is left out', () => {
  it('every rendered TextInput carries the default or an explicit prop', () => {
    const uiDir = path.join(__dirname, '..', 'ui');
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!entry.name.endsWith('.tsx')) continue;
        const source = fs.readFileSync(full, 'utf8');
        // Each `<TextInput` opening tag up to the end of its own props.
        for (const match of source.matchAll(/<TextInput\b[\s\S]*?\/>/g)) {
          const tag = match[0];
          const covered =
            tag.includes('{...textInputDefaults}') ||
            tag.includes('disableFullscreenUI=');
          if (!covered) {
            offenders.push(
              `${path.relative(uiDir, full)}: ${tag.slice(0, 60)}`
            );
          }
        }
      }
    };
    walk(uiDir);

    expect(offenders).toEqual([]);
  });
});

/** Keeps the unused import honest — `View` is here for JSX typing parity. */
void View;
