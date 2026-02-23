import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

describe('Tabs', () => {
  const renderTabs = (props = {}) =>
    render(
      <Tabs defaultValue='tab1' {...props}>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>
          <Text>Content 1</Text>
        </TabsContent>
        <TabsContent value='tab2'>
          <Text>Content 2</Text>
        </TabsContent>
        <TabsContent value='tab3'>
          <Text>Content 3</Text>
        </TabsContent>
      </Tabs>
    );

  it('renders tab triggers', () => {
    renderTabs();
    expect(screen.getByText('Tab 1')).toBeTruthy();
    expect(screen.getByText('Tab 2')).toBeTruthy();
    expect(screen.getByText('Tab 3')).toBeTruthy();
  });

  it('shows content for default tab', () => {
    renderTabs();
    expect(screen.getByText('Content 1')).toBeTruthy();
    expect(screen.queryByText('Content 2')).toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();
  });

  it('switches content when a tab is pressed', () => {
    renderTabs();

    // Initially tab 1 content is shown
    expect(screen.getByText('Content 1')).toBeTruthy();

    // Press tab 2
    fireEvent.press(screen.getByText('Tab 2'));
    expect(screen.queryByText('Content 1')).toBeNull();
    expect(screen.getByText('Content 2')).toBeTruthy();

    // Press tab 3
    fireEvent.press(screen.getByText('Tab 3'));
    expect(screen.queryByText('Content 2')).toBeNull();
    expect(screen.getByText('Content 3')).toBeTruthy();
  });

  it('calls onValueChange when tab changes', () => {
    const onValueChange = jest.fn();
    renderTabs({ onValueChange });

    fireEvent.press(screen.getByText('Tab 2'));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('works in controlled mode', () => {
    const onValueChange = jest.fn();
    const { rerender } = render(
      <Tabs value='tab1' onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>
          <Text>Content 1</Text>
        </TabsContent>
        <TabsContent value='tab2'>
          <Text>Content 2</Text>
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content 1')).toBeTruthy();

    // Press tab 2 - in controlled mode the parent decides
    fireEvent.press(screen.getByText('Tab 2'));
    expect(onValueChange).toHaveBeenCalledWith('tab2');

    // Content doesn't change until the parent updates the value prop
    expect(screen.getByText('Content 1')).toBeTruthy();

    // Rerender with updated value
    rerender(
      <Tabs value='tab2' onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>
          <Text>Content 1</Text>
        </TabsContent>
        <TabsContent value='tab2'>
          <Text>Content 2</Text>
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content 2')).toBeTruthy();
    expect(screen.queryByText('Content 1')).toBeNull();
  });

  it('tab triggers have tab accessibility role', () => {
    renderTabs();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
  });

  it('selected tab has selected accessibility state', () => {
    renderTabs();
    const tabs = screen.getAllByRole('tab');
    // First tab should be selected
    expect(tabs[0].props.accessibilityState).toEqual({
      selected: true,
      disabled: false,
    });
    // Second tab should not be selected
    expect(tabs[1].props.accessibilityState).toEqual({
      selected: false,
      disabled: false,
    });
  });

  it('disabled tab has disabled accessibility state', () => {
    render(
      <Tabs defaultValue='tab1'>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2' disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>
          <Text>Content 1</Text>
        </TabsContent>
        <TabsContent value='tab2'>
          <Text>Content 2</Text>
        </TabsContent>
      </Tabs>
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].props.accessibilityState).toEqual({
      selected: false,
      disabled: true,
    });
  });

  it('disabled tab does not switch content when pressed', () => {
    render(
      <Tabs defaultValue='tab1'>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2' disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>
          <Text>Content 1</Text>
        </TabsContent>
        <TabsContent value='tab2'>
          <Text>Content 2</Text>
        </TabsContent>
      </Tabs>
    );

    fireEvent.press(screen.getByText('Tab 2'));
    // Content 1 should still be visible
    expect(screen.getByText('Content 1')).toBeTruthy();
    expect(screen.queryByText('Content 2')).toBeNull();
  });
});

describe('TabsTrigger outside Tabs context', () => {
  it('throws when used outside Tabs', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TabsTrigger value='tab1'>Tab 1</TabsTrigger>)).toThrow(
      'Tabs components must be used within a Tabs provider'
    );

    consoleSpy.mockRestore();
  });
});

describe('TabsContent outside Tabs context', () => {
  it('throws when used outside Tabs', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <TabsContent value='tab1'>
          <Text>Content</Text>
        </TabsContent>
      )
    ).toThrow('Tabs components must be used within a Tabs provider');

    consoleSpy.mockRestore();
  });
});
