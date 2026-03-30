import { Config } from '../types';

export function formatTable(str: string, cog: Config): string {
  let table = splitStringToTable(str);
  table = fillInMissingColumns(table);
  const columnWidth: number[] = [];

  // Calculate column widths based on header length (minimum 1 for empty headers)
  if (table.length > 0) {
    table[0].forEach((headerCell, columnIndex) => {
      columnWidth[columnIndex] = Math.max(1, headerCell.length);
    });
  }

  return table
    .map((row: string[], rowIndex: number) => {
      const orgRows = row.map((cell, columnIndex) => {
        const needSpacePadding = cog.keepFirstAndLastPipes && cog.spacePadding;

        // Separator row - use calculated column width
        if (rowIndex === 1) {
          const separator = padHeaderSeparatorString(cell, columnWidth[columnIndex]);
          return needSpacePadding ? ` ${separator} ` : separator;
        }

        // Header and data rows - no padding
        if (cog.emptyPlaceholder && cell.trim().length === 0) {
          cell = cog.emptyPlaceholder;
        }
        // For empty cells with space padding, use single space
        if (needSpacePadding) {
          return cell === '' ? ' ' : ` ${cell} `;
        }
        return cell;
      });
      const rowStr = orgRows.join('|');
      return cog.keepFirstAndLastPipes ? `|${rowStr}|` : rowStr;
    })
    .join('\n');
}

function splitStringToTable(str: string): string[][] {
  return (
    str
      .trim()
      .split('\n')
      // trim space and "|", but respect empty first column
      // E.g. "| | Test a | Test b |"
      //   => "| Test a | Test b"
      .map((row) => row.replace(/^(\s*\|\s*|\s+)/, '').replace(/[|\s]+$/, ''))
      // Split rows into columns
      .map((row) => {
        let inCode = false;

        return (
          row
            .split('')
            // Split by "|", but only if not inside inline-code
            // E.g. "| Command | `ls | grep foo` |"
            //  =>  [ "Command","`ls | grep foo`" ]
            .reduce(
              (columns, c): string[] => {
                if (c === '`') {
                  // Switch mode
                  inCode = !inCode;
                }

                if (c === '|' && !inCode) {
                  // Add new Column
                  columns.push('');
                } else {
                  // Append char to current column
                  columns[columns.length - 1] += c;
                }

                return columns;
              },
              ['']
            )
            // Trim space in columns
            .map((column) => column.trim())
        );
      })
  );
}

function fillInMissingColumns(table: string[][]): string[][] {
  const max = table.reduce((max, item) => Math.max(max, item.length), 0);

  return table.map((row) => row.concat(Array(max - row.length).fill('')));
}

function padHeaderSeparatorString(str: string, len: number): string {
  switch (getAlignment(str)) {
    case 'c':
      return ':' + '-'.repeat(Math.max(1, len - 2)) + ':';
    case 'r':
      return '-'.repeat(Math.max(1, len - 1)) + ':';
    case 'l-explicit':
      return ':' + '-'.repeat(Math.max(1, len - 1));
    case 'l':
    default:
      return '-'.repeat(Math.max(1, len));
  }
}

function getAlignment(str: string): string {
  if (str.endsWith(':')) {
    if (str.startsWith(':')) {
      return 'c';
    }

    return 'r';
  }

  // Check for explicit left alignment (:- or :---)
  if (str.startsWith(':')) {
    return 'l-explicit';
  }

  return 'l';
}



