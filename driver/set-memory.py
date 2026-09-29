#!/usr/bin/env python3
"""Inspect or change FreeMote's compiled heap/stack defaults (sizes in MiB)."""
import argparse
import os
from pathlib import Path
import re
import tempfile

MIB = 1024 * 1024
PATTERNS = {
    name: re.compile(r'(var ' + name + r'=Module\["' + name + r'"\]\|\|)(\d+)(;)')
    for name in ('TOTAL_MEMORY', 'TOTAL_STACK')
}


def defaults(source):
    result = {}
    for name, pattern in PATTERNS.items():
        matches = list(pattern.finditer(source))
        if len(matches) != 1:
            raise ValueError(f'{name}: expected exactly one default; found {len(matches)}. File unchanged.')
        result[name] = int(matches[0].group(2))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--heap-mib', type=int, help='total heap buffer capacity; a multiple of 16 MiB')
    parser.add_argument('--stack-mib', type=int, help='stack reservation inside that buffer, in MiB')
    parser.add_argument('--driver', type=Path, default=Path(__file__).resolve().with_name('FreeMoteDriver.js'),
                        help='driver file to inspect/edit (defaults to the file beside this script)')
    args = parser.parse_args()
    try:
        path = args.driver.resolve()
        source = path.read_text(encoding='utf-8')
        old = defaults(source)
        values = dict(old)
        if args.heap_mib is not None:
            if args.heap_mib < 16 or args.heap_mib % 16:
                raise ValueError('Heap must be at least 16 MiB and a multiple of 16 (driver allocation granularity).')
            values['TOTAL_MEMORY'] = args.heap_mib * MIB
        if args.stack_mib is not None:
            if args.stack_mib <= 0:
                raise ValueError('Stack must be a positive number of MiB.')
            values['TOTAL_STACK'] = args.stack_mib * MIB
        if args.heap_mib is not None or args.stack_mib is not None:
            if values['TOTAL_MEMORY'] < 2 * values['TOTAL_STACK']:
                raise ValueError('Heap must be at least twice the stack; otherwise this driver silently enlarges it.')
            if values['TOTAL_MEMORY'] >= 2 ** 31:
                raise ValueError('This legacy driver requires a heap below 2 GiB.')
        updated = source
        for name, pattern in PATTERNS.items():
            if values[name] != old[name]:
                updated = pattern.sub(lambda match, n=name: match[1] + str(values[n]) + match[3], updated)
        if updated != source:
            # Replace atomically so an interrupted edit cannot leave a partial driver.
            temporary = None
            try:
                with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', newline='',
                                                 dir=path.parent, delete=False) as out:
                    temporary = Path(out.name)
                    out.write(updated)
                temporary.chmod(path.stat().st_mode & 0o777)
                os.replace(temporary, path)
            finally:
                if temporary is not None and temporary.exists():
                    temporary.unlink()
            print(f'Updated {path}. Reload the page with cache disabled to test.')
        else:
            print(f'Unchanged: {path}')
        for name, value in values.items():
            print(f'{name}: {value / MIB:g} MiB ({value} bytes)')
        print('Defaults only: EmoteModule/Module overrides still take precedence. Automatic heap growth is unavailable.')
    except (OSError, ValueError) as error:
        parser.exit(2, f'Error: {error}\n')


if __name__ == '__main__':
    main()
