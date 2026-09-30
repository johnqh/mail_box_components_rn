/**
 * Where a select's choices open on a tablet: beside the control that asked.
 *
 * A sheet rising from the bottom edge is a phone's idiom — the thumb is
 * there, and the screen is narrow enough that the sheet is near whatever was
 * pressed. On a tablet it is neither: the control is often at the far side of
 * a wide screen, and a sheet along the bottom edge takes the eye and the hand
 * a screen's length away from a choice of three things. The platform's own
 * answer there is a menu anchored to the control, and this places one.
 *
 * Below the control and aligned to its leading edge, which is where a menu
 * is expected. Above it when there is not room below and there is more above
 * — a picker at the foot of a settings pane. Pulled back inside the window
 * when the control is near the trailing edge. The list is as tall as its
 * rows, up to a limit and up to what the window has left, and scrolls past
 * that.
 */
export type PopoverAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PopoverPlacement = {
  left: number;
  width: number;
  maxHeight: number;
  /** One or the other: the edge the card hangs from. */
  top?: number;
  bottom?: number;
};

/** The narrowest the card is drawn, however narrow its control. */
export const POPOVER_MIN_WIDTH = 240;
/** The tallest the card is drawn before its list scrolls. */
export const POPOVER_MAX_HEIGHT = 360;
/** Between the card and the control, and between the card and the window. */
export const POPOVER_GAP = 4;
export const POPOVER_MARGIN = 12;

export function popoverPlacement(
  anchor: PopoverAnchor,
  window: { width: number; height: number }
): PopoverPlacement {
  const width = Math.min(
    Math.max(anchor.width, POPOVER_MIN_WIDTH),
    window.width - POPOVER_MARGIN * 2
  );
  const left = Math.max(
    POPOVER_MARGIN,
    Math.min(anchor.x, window.width - POPOVER_MARGIN - width)
  );

  const below =
    window.height - (anchor.y + anchor.height) - POPOVER_GAP - POPOVER_MARGIN;
  const above = anchor.y - POPOVER_GAP - POPOVER_MARGIN;
  // Below unless that is cramped and above is roomier: a menu that opens
  // upward is the exception, and should need a reason.
  if (below >= POPOVER_MAX_HEIGHT / 2 || below >= above) {
    return {
      left,
      width,
      top: anchor.y + anchor.height + POPOVER_GAP,
      maxHeight: Math.max(0, Math.min(POPOVER_MAX_HEIGHT, below)),
    };
  }
  return {
    left,
    width,
    bottom: window.height - anchor.y + POPOVER_GAP,
    maxHeight: Math.max(0, Math.min(POPOVER_MAX_HEIGHT, above)),
  };
}

/** As much of a view as measuring one needs. */
type Measurable = {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void
  ) => void;
};

/**
 * Where a control is in the window, now.
 *
 * Its own function so that a test can say where, which a test renderer
 * cannot: it lays nothing out, and its `measureInWindow` never answers.
 */
export function measureAnchor(
  view: Measurable,
  onMeasured: (anchor: PopoverAnchor) => void
): void {
  view.measureInWindow((x, y, width, height) =>
    onMeasured({ x, y, width, height })
  );
}
