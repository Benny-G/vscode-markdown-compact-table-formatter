export interface Config {
  /**
   * Enable or disable the formatter.
   */
  enable: boolean;
  /**
   * Pad columns with a single space. (default: `true`)
   */
  spacePadding: boolean;
  /**
   * Keep first and last pipes `|` in table formatting. (tables are easier to render when pipes are kept)
   */
  keepFirstAndLastPipes: boolean;
  /**
   * Value to insert when a cell is empty. (default: `-`)
   */
  emptyPlaceholder: string;
}
