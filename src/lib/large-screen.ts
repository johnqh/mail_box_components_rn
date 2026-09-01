/**
 * Where a full-screen panel stops being right.
 *
 * A picker or a dialog fills the screen on a phone because the screen is the
 * size of a panel. On a tablet or a Mac window it is not: a full-bleed list of
 * eight clefs across fourteen hundred points reads as the app having lost its
 * place, not as a picker.
 *
 * One number, shared, because `FormModal` and `SheetSelector` both have to
 * make this call and two breakpoints would put a dialog and the picker inside
 * it on opposite sides of it at some window width.
 */
export const TABLET_MIN_WIDTH = 768;

/** How wide a centred panel may get, whatever the window does. */
export const PANEL_MAX_WIDTH = 420;

/** The gutter kept either side of a centred panel on a narrow-ish window. */
export const PANEL_MARGIN = 32;
