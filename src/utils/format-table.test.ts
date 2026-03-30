import { formatTable } from './format-table';
import { Config } from '../types';

describe('formatTable', () => {
  const defaultConfig: Config = {
    enable: true,
    spacePadding: true,
    keepFirstAndLastPipes: true,
    emptyPlaceholder: '',
  };

  describe('basic table formatting', () => {
    it('should format a simple table with space padding and pipes', () => {
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2|Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle tables with uneven whitespace', () => {
      const input = `
  Header 1  |  Header 2  |  Header 3  
  ---|---|---  
  Cell 1  |  Cell 2  |  Cell 3  
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle tables with existing pipes at start and end', () => {
      const input = `
| Header 1 | Header 2 | Header 3 |
| --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });

  describe('space padding configuration', () => {
    it('should format without space padding when spacePadding is false', () => {
      const config: Config = { ...defaultConfig, spacePadding: false };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2|Cell 3
`;
      const expected = `
|Header 1|Header 2|Header 3|
|--------|--------|--------|
|Cell 1|Cell 2|Cell 3|
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });

    it('should format with space padding when spacePadding is true', () => {
      const config: Config = { ...defaultConfig, spacePadding: true };
      const input = `
H1|H2|H3
---|---|---
C1|C2|C3
`;
      const expected = `
| H1 | H2 | H3 |
| -- | -- | -- |
| C1 | C2 | C3 |
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });
  });

  describe('keepFirstAndLastPipes configuration', () => {
    it('should format without first and last pipes when keepFirstAndLastPipes is false', () => {
      const config: Config = { ...defaultConfig, keepFirstAndLastPipes: false };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2|Cell 3
`;
      const expected = `
Header 1|Header 2|Header 3
--------|--------|--------
Cell 1|Cell 2|Cell 3
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });

    it('should format without space padding and without pipes', () => {
      const config: Config = {
        ...defaultConfig,
        spacePadding: false,
        keepFirstAndLastPipes: false,
      };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2|Cell 3
`;
      const expected = `
Header 1|Header 2|Header 3
--------|--------|--------
Cell 1|Cell 2|Cell 3
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });
  });

  describe('empty cells and placeholder', () => {
    it('should replace empty cells with placeholder when configured', () => {
      const config: Config = { ...defaultConfig, emptyPlaceholder: '-' };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1||Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | - | Cell 3 |
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });

    it('should use custom empty placeholder', () => {
      const config: Config = { ...defaultConfig, emptyPlaceholder: 'N/A' };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1||Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | N/A | Cell 3 |
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });

    it('should handle cells with only whitespace as empty when placeholder configured', () => {
      const config: Config = { ...defaultConfig, emptyPlaceholder: '-' };
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|   |Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | - | Cell 3 |
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });

    it('should leave empty cells empty by default', () => {
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1||Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });

  describe('inline code with pipes', () => {
    it('should not split on pipes inside inline code', () => {
      const input = `
Command|Description
---|---
\`ls | grep foo\`|List and filter
`;
      const expected = `
| Command | Description |
| ------- | ----------- |
| \`ls | grep foo\` | List and filter |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle multiple inline code blocks in a cell', () => {
      const input = `
Command|Description
---|---
\`echo\` and \`cat | grep\`|Multiple commands
`;
      const expected = `
| Command | Description |
| ------- | ----------- |
| \`echo\` and \`cat | grep\` | Multiple commands |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });

  describe('column alignment', () => {
    it('should handle left-aligned columns (default)', () => {
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2|Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle center-aligned columns', () => {
      const input = `
Header 1|Header 2|Header 3
:---:|:---:|:---:
Cell 1|Cell 2|Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| :------: | :------: | :------: |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle right-aligned columns', () => {
      const input = `
Header 1|Header 2|Header 3
---:|---:|---:
Cell 1|Cell 2|Cell 3
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------: | -------: | -------: |
| Cell 1 | Cell 2 | Cell 3 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle mixed alignment', () => {
      const input = `
Left|Center|Right
---|:---:|---:
A|B|C
`;
      const expected = `
| Left | Center | Right |
| ---- | :----: | ----: |
| A | B | C |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle single character headings with mixed alignment', () => {
      const input = `
A|B|C|D
---|:---:|---:|:---
1|2|3|4
`;
      const expected = `
| A | B | C | D |
| - | :-: | -: | :- |
| 1 | 2 | 3 | 4 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });

  describe('missing columns', () => {
    it('should fill in missing columns with empty cells', () => {
      const input = `
Header 1|Header 2|Header 3
---|---|---
Cell 1|Cell 2
Cell A
`;
      const expected = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1 | Cell 2 | |
| Cell A | | |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle rows with extra columns', () => {
      const input = `
Header 1|Header 2
---|---
Cell 1|Cell 2|Cell 3|Cell 4
`;
      const expected = `
| Header 1 | Header 2 | | |
| -------- | -------- | - | - |
| Cell 1 | Cell 2 | Cell 3 | Cell 4 |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle single column tables', () => {
      const input = `
Header
---
Cell
`;
      const expected = `
| Header |
| ------ |
| Cell |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle tables with very long header values', () => {
      const input = `
Very Long Header Name|Short
---|---
A|B
`;
      const expected = `
| Very Long Header Name | Short |
| --------------------- | ----- |
| A | B |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle empty first column', () => {
      const input = `
| | Test a | Test b |
|---|---|---|
| | Value a | Value b |
`;
      const expected = `
| | Test a | Test b |
| - | ------ | ------ |
| | Value a | Value b |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should handle minimum separator length', () => {
      const config: Config = {
        ...defaultConfig,
        spacePadding: false,
        keepFirstAndLastPipes: false,
      };
      const input = `
A|B|C
---|---|---
1|2|3
`;
      const expected = `
A|B|C
-|-|-
1|2|3
`.trim();
      expect(formatTable(input, config)).toBe(expected);
    });
  });

  describe('multi-row tables', () => {
    it('should format tables with multiple data rows', () => {
      const input = `
Name|Age|City
---|---|---
John|25|NYC
Jane|30|LA
Bob|35|Chicago
`;
      const expected = `
| Name | Age | City |
| ---- | --- | ---- |
| John | 25 | NYC |
| Jane | 30 | LA |
| Bob | 35 | Chicago |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });

    it('should maintain proper separator width based on header', () => {
      const input = `
Short|H2
---|---
Very Long Content|B
C|Also Very Long
`;
      const expected = `
| Short | H2 |
| ----- | -- |
| Very Long Content | B |
| C | Also Very Long |
`.trim();
      expect(formatTable(input, defaultConfig)).toBe(expected);
    });
  });
});

