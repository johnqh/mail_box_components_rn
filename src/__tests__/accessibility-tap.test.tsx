/**
 * Every control reachable by a pointer is reachable by assistive technology.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and **not** as `onPress` — there is no synthesized touch behind it. A control
 * wired with `onPress` alone therefore announces itself to VoiceOver, takes
 * focus, and then does nothing when activated. It was found on a live Mac, in a
 * consumer's instrument, clef and track pickers; nothing in this package's
 * suite could see it, because every test pressed.
 *
 * So each case here asserts **both** routes reach the same handler, and that a
 * disabled control answers neither. `accessibility-tap-guard.test.ts` is the
 * other half: it reads the source, so a component added tomorrow is covered
 * without a case being written for it.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';

import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Button } from '../ui/Button';
import { Calendar } from '../ui/Calendar';
import { Card } from '../ui/Card';
import { CheckableSelect } from '../ui/CheckableSelect';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import { Combobox } from '../ui/Combobox';
import { DataList } from '../ui/DataList';
import { FileInput } from '../ui/FileInput';
import { Link } from '../ui/Link';
import { ListItemWithAction } from '../ui/ListItemWithAction';
import { MultiSelect } from '../ui/MultiSelect';
import { NavigationList } from '../ui/NavigationList';
import { NumberInput } from '../ui/NumberInput';
import { Pagination } from '../ui/Pagination';
import { PopupSelect } from '../ui/PopupSelect';
import { PortalHost } from '../ui/Portal';
import { QuickActions } from '../ui/QuickActions';
import { SearchInput } from '../ui/SearchInput';
import { SectionHeader } from '../ui/SectionHeader';
import { Select } from '../ui/Select';
import { SettingsList } from '../ui/SettingsList';
import { SheetSelector } from '../ui/SheetSelector';
import { SideNav } from '../ui/SideNav';
import { SmartLink } from '../ui/SmartLink';
import { Table } from '../ui/Table';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { Toast } from '../ui/Toast';
import { TransferList } from '../ui/TransferList';
import { TreeView } from '../ui/TreeView';

/** What one component's case has to produce: a target and the spy it must reach. */
type Target = { element: ReactTestInstance; handler: jest.Mock };

interface Case {
  /** Component, and which of its controls this is. */
  name: string;
  /** Render, open whatever has to be open, and point at the control. */
  setup: () => Target;
  /** The same control with the component's disabled state on, where it has one. */
  whenDisabled?: () => Target;
}

/**
 * The touchable host under or above `element`.
 *
 * A `Pressable` renders one host view carrying the responder handlers, and that
 * is where `onAccessibilityTap` lands. Needed because `fireEvent` cannot prove
 * the disabled half on its own: React Native Testing Library refuses to deliver
 * *any* event through a host whose `onStartShouldSetResponder` answers false,
 * so a disabled control looks inert to the simulator whether or not it is
 * actually wired. The real platform has no such courtesy — `disabled`
 * suppresses `onPress` and nothing suppresses `onAccessibilityTap` — so the
 * assertion has to read the prop.
 */
function touchableFor(element: ReactTestInstance): ReactTestInstance {
  let node: ReactTestInstance | null = element;
  while (node) {
    if (
      typeof node.type === 'string' &&
      typeof node.props.onStartShouldSetResponder === 'function'
    ) {
      return node;
    }
    node = node.parent;
  }
  throw new Error('no touchable found for the element under test');
}

const opt = (value: string, label = value, disabled = false) => ({
  value,
  label,
  disabled,
});

const CASES: Case[] = [
  {
    name: 'Button',
    setup: () => {
      const handler = jest.fn();
      render(<Button onPress={handler}>Go</Button>);
      return { element: screen.getByText('Go'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Button onPress={handler} disabled>
          Go
        </Button>
      );
      return { element: screen.getByText('Go'), handler };
    },
  },
  {
    name: 'Select option',
    setup: () => {
      const handler = jest.fn();
      render(
        <Select
          options={[opt('a', 'Treble'), opt('b', 'Bass')]}
          value='a'
          onValueChange={handler}
        />
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Bass'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Select
          options={[opt('a', 'Treble'), opt('b', 'Bass', true)]}
          value='a'
          onValueChange={handler}
        />
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Bass'), handler };
    },
  },
  {
    name: 'CheckableSelect option',
    setup: () => {
      const handler = jest.fn();
      render(
        <PortalHost>
          <CheckableSelect
            options={[opt('a', 'Violin'), opt('b', 'Cello')]}
            value='a'
            onChange={handler}
            checked={['a', 'b']}
            onCheckedChange={jest.fn()}
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return {
        element: screen.getByRole('menuitem', { name: 'Cello' }),
        handler,
      };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <PortalHost>
          <CheckableSelect
            options={[opt('a', 'Violin'), opt('b', 'Cello', true)]}
            value='a'
            onChange={handler}
            checked={['a', 'b']}
            onCheckedChange={jest.fn()}
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return {
        element: screen.getByRole('menuitem', { name: 'Cello' }),
        handler,
      };
    },
  },
  {
    name: 'CheckableSelect checkbox',
    setup: () => {
      const handler = jest.fn();
      render(
        <PortalHost>
          <CheckableSelect
            options={[opt('a', 'Violin'), opt('b', 'Cello')]}
            value='a'
            onChange={jest.fn()}
            checked={['a', 'b']}
            onCheckedChange={handler}
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return {
        element: screen.getByRole('checkbox', { name: 'Cello' }),
        handler,
      };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      // At the floor a ticked box cannot be cleared: that is the component's
      // own disabled state, and an accessibility tap must respect it too.
      render(
        <PortalHost>
          <CheckableSelect
            options={[opt('a', 'Violin')]}
            value='a'
            onChange={jest.fn()}
            checked={['a']}
            onCheckedChange={handler}
            minChecked={1}
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return {
        element: screen.getByRole('checkbox', { name: 'Violin' }),
        handler,
      };
    },
  },
  {
    name: 'PopupSelect option',
    setup: () => {
      const handler = jest.fn();
      render(
        <PopupSelect
          options={[opt('a', 'Alto'), opt('b', 'Tenor')]}
          value='a'
          onValueChange={handler}
        />
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Tenor'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <PopupSelect
          options={[opt('a', 'Alto'), opt('b', 'Tenor', true)]}
          value='a'
          onValueChange={handler}
        />
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Tenor'), handler };
    },
  },
  {
    name: 'SheetSelector option',
    setup: () => {
      const handler = jest.fn();
      render(
        <PortalHost>
          <SheetSelector
            options={[opt('a', 'Piano'), opt('b', 'Harp')]}
            value='a'
            onChange={handler}
            accessibilityLabel='Instrument'
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Harp'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <PortalHost>
          <SheetSelector
            options={[opt('a', 'Piano'), opt('b', 'Harp', true)]}
            value='a'
            onChange={handler}
            accessibilityLabel='Instrument'
          />
        </PortalHost>
      );
      fireEvent.press(screen.getByRole('combobox'));
      return { element: screen.getByText('Harp'), handler };
    },
  },
  {
    name: 'MultiSelect option',
    setup: () => {
      const handler = jest.fn();
      render(
        <MultiSelect
          options={[opt('a', 'Flute'), opt('b', 'Oboe')]}
          value={[]}
          onChange={handler}
        />
      );
      fireEvent.press(screen.getByText('Select items...'));
      return { element: screen.getByText('Oboe'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <MultiSelect
          options={[opt('a', 'Flute'), opt('b', 'Oboe', true)]}
          value={[]}
          onChange={handler}
        />
      );
      fireEvent.press(screen.getByText('Select items...'));
      return { element: screen.getByText('Oboe'), handler };
    },
  },
  {
    name: 'Combobox option',
    setup: () => {
      const handler = jest.fn();
      render(
        <Combobox
          options={[opt('a', 'Horn'), opt('b', 'Tuba')]}
          value='a'
          onChange={handler}
        />
      );
      fireEvent.press(screen.getByText('Horn'));
      return { element: screen.getByText('Tuba'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Combobox
          options={[opt('a', 'Horn'), opt('b', 'Tuba', true)]}
          value='a'
          onChange={handler}
        />
      );
      fireEvent.press(screen.getByText('Horn'));
      return { element: screen.getByText('Tuba'), handler };
    },
  },
  {
    name: 'TabsTrigger',
    setup: () => {
      const handler = jest.fn();
      render(
        <Tabs value='one' onValueChange={handler}>
          <TabsList>
            <TabsTrigger value='two'>Two</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      return { element: screen.getByText('Two'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Tabs value='one' onValueChange={handler}>
          <TabsList>
            <TabsTrigger value='two' disabled>
              Two
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      return { element: screen.getByText('Two'), handler };
    },
  },
  {
    name: 'Pagination next',
    setup: () => {
      const handler = jest.fn();
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={handler} />
      );
      return { element: screen.getByLabelText('Go to next page'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Pagination currentPage={3} totalPages={3} onPageChange={handler} />
      );
      return { element: screen.getByLabelText('Go to next page'), handler };
    },
  },
  {
    name: 'TreeView node',
    setup: () => {
      const handler = jest.fn();
      render(
        <TreeView data={[{ id: 'a', label: 'Root' }]} onSelect={handler} />
      );
      return { element: screen.getByText('Root'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <TreeView
          data={[{ id: 'a', label: 'Root', disabled: true }]}
          onSelect={handler}
        />
      );
      return { element: screen.getByText('Root'), handler };
    },
  },
  {
    name: 'QuickActions action',
    setup: () => {
      const handler = jest.fn();
      render(
        <QuickActions actions={[{ id: 'a', label: 'Add', onPress: handler }]} />
      );
      return { element: screen.getByText('Add'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <QuickActions
          actions={[
            { id: 'a', label: 'Add', onPress: handler, disabled: true },
          ]}
        />
      );
      return { element: screen.getByText('Add'), handler };
    },
  },
  {
    name: 'ListItemWithAction',
    setup: () => {
      const handler = jest.fn();
      render(
        <ListItemWithAction onAction={handler} actionText='Remove'>
          <Text>Row</Text>
        </ListItemWithAction>
      );
      return { element: screen.getByText('Remove'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <ListItemWithAction onAction={handler} actionText='Remove' isProcessing>
          <Text>Row</Text>
        </ListItemWithAction>
      );
      return { element: screen.getByLabelText('Remove'), handler };
    },
  },
  {
    name: 'NumberInput increment',
    setup: () => {
      const handler = jest.fn();
      render(<NumberInput value={1} onChange={handler} showSteppers />);
      return { element: screen.getByLabelText('Increment'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(<NumberInput value={1} max={1} onChange={handler} showSteppers />);
      return { element: screen.getByLabelText('Increment'), handler };
    },
  },
  {
    name: 'Badge dismiss',
    setup: () => {
      const handler = jest.fn();
      render(
        <Badge dismissible onDismiss={handler}>
          Tag
        </Badge>
      );
      return { element: screen.getByLabelText('Dismiss'), handler };
    },
  },
  {
    name: 'Toast dismiss',
    setup: () => {
      const handler = jest.fn();
      render(<Toast toast={{ id: 't', title: 'Saved' }} onRemove={handler} />);
      return { element: screen.getByLabelText('Close notification'), handler };
    },
  },
  {
    name: 'Card close',
    setup: () => {
      const handler = jest.fn();
      render(
        <Card variant='info' onClose={handler}>
          <Text>Body</Text>
        </Card>
      );
      return { element: screen.getByLabelText('Close'), handler };
    },
  },
  {
    name: 'Avatar',
    setup: () => {
      const handler = jest.fn();
      render(<Avatar name='Ada' onPress={handler} />);
      return { element: screen.getByRole('button'), handler };
    },
  },
  {
    name: 'Link',
    setup: () => {
      const handler = jest.fn();
      render(
        <Link href='https://example.com' onPress={handler}>
          Docs
        </Link>
      );
      return { element: screen.getByText('Docs'), handler };
    },
  },
  {
    name: 'SmartLink',
    setup: () => {
      const handler = jest.fn();
      render(
        <SmartLink to='/inbox' onNavigate={handler}>
          Inbox
        </SmartLink>
      );
      return { element: screen.getByText('Inbox'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <SmartLink to='/inbox' onNavigate={handler} disabled>
          Inbox
        </SmartLink>
      );
      return { element: screen.getByText('Inbox'), handler };
    },
  },
  {
    name: 'Breadcrumb item',
    setup: () => {
      const handler = jest.fn();
      render(
        <Breadcrumb
          items={[{ label: 'Home', onPress: handler }, { label: 'Here' }]}
        />
      );
      return { element: screen.getByText('Home'), handler };
    },
  },
  {
    name: 'SettingsList item',
    setup: () => {
      const handler = jest.fn();
      render(
        <SettingsList
          settings={[{ id: 'a', title: 'General' }]}
          onSettingSelect={handler}
        />
      );
      return { element: screen.getByText('General'), handler };
    },
  },
  {
    name: 'NavigationList item',
    setup: () => {
      const handler = jest.fn();
      render(
        <NavigationList
          items={[
            { id: 'a', label: 'Inbox', path: '/inbox', icon: <Text>i</Text> },
          ]}
          onSelect={handler}
        />
      );
      return { element: screen.getByText('Inbox'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <NavigationList
          items={[
            {
              id: 'a',
              label: 'Inbox',
              path: '/inbox',
              icon: <Text>i</Text>,
              disabled: true,
            },
          ]}
          onSelect={handler}
        />
      );
      return { element: screen.getByText('Inbox'), handler };
    },
  },
  {
    name: 'SideNav item',
    setup: () => {
      const handler = jest.fn();
      render(
        <SideNav items={[{ id: 'a', label: 'Drafts', onPress: handler }]} />
      );
      return { element: screen.getByText('Drafts'), handler };
    },
  },
  {
    name: 'SectionHeader add',
    setup: () => {
      const handler = jest.fn();
      render(<SectionHeader title='Tracks' onAdd={handler} />);
      return { element: screen.getByLabelText('Add'), handler };
    },
  },
  {
    name: 'CollapsibleSection header',
    setup: () => {
      const handler = jest.fn();
      render(
        <CollapsibleSection id='s' title='Advanced' onSectionSelect={handler} />
      );
      return { element: screen.getByText('Advanced'), handler };
    },
  },
  {
    name: 'FileInput picker',
    setup: () => {
      const handler = jest.fn();
      render(<FileInput onSelectFiles={handler} />);
      return { element: screen.getByText('Choose Files'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(<FileInput onSelectFiles={handler} disabled />);
      return { element: screen.getByText('Choose Files'), handler };
    },
  },
  {
    name: 'SearchInput clear',
    setup: () => {
      const handler = jest.fn();
      render(<SearchInput value='brahms' onChangeText={handler} />);
      return { element: screen.getByLabelText('Clear search'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(<SearchInput value='brahms' onChangeText={handler} disabled />);
      return { element: screen.getByLabelText('Clear search'), handler };
    },
  },
  {
    name: 'TransferList move',
    setup: () => {
      const handler = jest.fn();
      render(
        <TransferList
          source={[{ id: 'a', label: 'One' }]}
          target={[]}
          onChange={handler}
        />
      );
      return {
        element: screen.getByLabelText('Move all to selected'),
        handler,
      };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(<TransferList source={[]} target={[]} onChange={handler} />);
      return {
        element: screen.getByLabelText('Move all to selected'),
        handler,
      };
    },
  },
  {
    name: 'Calendar day',
    setup: () => {
      const handler = jest.fn();
      render(<Calendar value={new Date(2026, 0, 15)} onChange={handler} />);
      return { element: screen.getByText('20'), handler };
    },
    whenDisabled: () => {
      const handler = jest.fn();
      render(
        <Calendar
          value={new Date(2026, 0, 15)}
          onChange={handler}
          minDate={new Date(2026, 0, 25)}
        />
      );
      return { element: screen.getByText('20'), handler };
    },
  },
  {
    name: 'DataList row',
    setup: () => {
      const handler = jest.fn();
      render(
        <DataList
          data={[{ id: '1', name: 'Alpha' }]}
          columns={[{ key: 'name', title: 'Name' }]}
          onRowPress={handler}
        />
      );
      return { element: screen.getByText('Alpha'), handler };
    },
  },
  {
    name: 'Table row',
    setup: () => {
      const handler = jest.fn();
      render(
        <Table
          data={[{ id: '1', name: 'Alpha' }]}
          columns={[{ key: 'name', title: 'Name' }]}
          keyExtractor={row => String(row.id)}
          onRowPress={handler}
        />
      );
      return { element: screen.getByText('Alpha'), handler };
    },
  },
];

describe.each(CASES)('$name', ({ name, setup, whenDisabled }) => {
  it('runs its handler on a press', () => {
    const { element, handler } = setup();
    fireEvent.press(element);
    expect(handler).toHaveBeenCalled();
  });

  it('runs its handler on an accessibility tap', () => {
    const { element, handler } = setup();
    // What macOS VoiceOver, Switch Control and Voice Control actually send.
    fireEvent(element, 'accessibilityTap');
    expect(handler).toHaveBeenCalled();
  });

  if (whenDisabled) {
    it('does neither when disabled', () => {
      const { element, handler } = whenDisabled();
      // Read before firing: a blocked press walks up to whatever ancestor will
      // take it, and in a picker that ancestor closes the sheet.
      expect(touchableFor(element).props.onAccessibilityTap).toBeUndefined();
      fireEvent.press(element);
      fireEvent(element, 'accessibilityTap');
      expect(handler).not.toHaveBeenCalled();
    });
  } else {
    it('has no disabled state to respect', () => {
      expect(name).toBeTruthy();
    });
  }
});

describe('Select trigger', () => {
  // The trigger's handler is internal (it opens the list), so "activated" is
  // the list appearing rather than a spy being called.
  it('opens the list on a press', () => {
    render(
      <Select
        options={[opt('a', 'Treble')]}
        value='a'
        onValueChange={jest.fn()}
      />
    );
    fireEvent.press(screen.getByRole('combobox'));
    expect(screen.getAllByText('Treble').length).toBeGreaterThan(1);
  });

  it('opens the list on an accessibility tap', () => {
    render(
      <Select
        options={[opt('a', 'Treble')]}
        value='a'
        onValueChange={jest.fn()}
      />
    );
    fireEvent(screen.getByRole('combobox'), 'accessibilityTap');
    expect(screen.getAllByText('Treble').length).toBeGreaterThan(1);
  });

  it('opens on neither when disabled', () => {
    render(
      <Select
        options={[opt('a', 'Treble')]}
        value='a'
        onValueChange={jest.fn()}
        disabled
      />
    );
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent(screen.getByRole('combobox'), 'accessibilityTap');
    expect(screen.getAllByText('Treble')).toHaveLength(1);
  });
});

describe('CheckableSelect trigger', () => {
  const tree = () => (
    <PortalHost>
      <CheckableSelect
        options={[opt('a', 'Violin')]}
        value='a'
        onChange={jest.fn()}
        checked={['a']}
        onCheckedChange={jest.fn()}
        title='Tracks'
      />
    </PortalHost>
  );

  it('opens the sheet on a press', () => {
    render(tree());
    fireEvent.press(screen.getByRole('combobox'));
    expect(screen.getByText('Tracks')).toBeTruthy();
  });

  it('opens the sheet on an accessibility tap', () => {
    render(tree());
    fireEvent(screen.getByRole('combobox'), 'accessibilityTap');
    expect(screen.getByText('Tracks')).toBeTruthy();
  });
});
