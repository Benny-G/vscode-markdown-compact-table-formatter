# Benny-G / Markdown Compact Table Formatter

Format Markdown tables using compact style compatible with [markdownlint/MD060](https://github.com/DavidAnson/markdownlint/blob/main/doc/md060.md) with aligned_delimiter enabled _like this:_

```yml
"MD060": {
    "style": "compact",
    "aligned_delimiter": true
}
```

Compact table formatting reduces noise from white space updates in comparisons making it easier to see and review **_actual changes made_**.

It also reduces diff sizes, but that's more of a bonus.

## Usage

Runs as part of VS Code `Format Document` and `Format Selection`.

![feature X](animation.gif)

### Settings

- **enable** - Enable or disable the formatter.
- **spacePadding** - Pad columns with a single space. (default: `true`)
- **keepFirstAndLastPipes** - Keep first and last pipes `|` in table formatting. (tables are easier to render when pipes are kept)
- **emptyPlaceholder** - Value to insert when a cell is empty. (default: `-`)

<!-- prompt: Make sure the config descriptions in package.json and types.ts match the descriptions in the repo README.md file. -->

## License

See: [LICENSE.md](https://github.com/Benny-G/vscode-markdown-compact-table-formatter/blob/master/LICENSE)
