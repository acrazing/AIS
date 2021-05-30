/*
 * @since 2021-05-16 14:28:09
 * @author junbao <junbao@mymoement.com>
 */

import { sprintf } from 'sprintf-js';
import strftime from 'strftime';
import { AutoIncrementSource } from './AutoIncrementSource';
import { JSONValue } from './types';

export interface SourceChunk {
  type: 'source';
  name: string;
  format: string;
}

export interface LiteralChunk {
  type: 'literal';
  value: string;
}

export interface SerialNumberOptions {
  name: string;

  /**
   * A serial number expression is a string contains one or more string literals or
   * auto increment sources.
   *
   * The string literals may contain some special characters, which will be replaced
   * with corresponding values during calculation. The auto increment sources are
   * wrapped by {...}. It may contains pipe to format the number. For example:
   *
   * ```
   * A-%m-%d-{ ais | %02d }
   * ```
   *
   * `A` is a pure string, `%m` and `%d` is special characters, which will be replaced
   * with current month and date. ais is a auto increment source's name, and %02d is
   * the format of the value. It could output something like this:
   *
   * ```
   * A-05-16-01
   * ```
   *
   * Special characters:
   *
   * 1. `%x: Which is a user-defined format string which specifies the format in which
   *    to display the date and time.  The format string may contain any of the conversion
   *    specifications described in the strftime
   * {@see https://man7.org/linux/man-pages/man3/strftime.3.html}.
   *
   * Auto increment source format respects `sprintf-js`
   * {@see https://www.npmjs.com/package/sprintf-js#format-specification}.
   */
  expression: string;

  /**
   * Keyboard shortcut, works on desktop only, respects Electron's Accelerator
   * {@see https://www.electronjs.org/docs/api/accelerator}.
   */
  shortcut: string;
}

export interface SerialNumberModel extends SerialNumberOptions {
  value: string;
  createdAt: Date;
  executeCount: number;
  executedAt: Date;
}

export class SerialNumber {
  model: SerialNumberModel;

  parsedExpression!: Array<LiteralChunk | SourceChunk>;
  sources: Map<string, AutoIncrementSource>;

  constructor(model: JSONValue<SerialNumberModel>, sources: Map<string, AutoIncrementSource>) {
    this.model = {
      ...model,
      createdAt: new Date(model.createdAt),
      executedAt: new Date(model.executedAt),
    };
    this.sources = sources;
    this.parsedExpression = this.parse(model.expression);
  }

  private parse(expression: string) {
    const results: Array<SourceChunk | LiteralChunk> = [];
    let lastIndex = 0;
    while (true) {
      const startIndex = expression.indexOf('{', lastIndex);
      if (startIndex === -1) {
        results.push({ type: 'literal', value: expression.substring(lastIndex) });
        break;
      } else {
        results.push({ type: 'literal', value: expression.substring(lastIndex, startIndex) });
        const endIndex = expression.indexOf('}', startIndex);
        if (endIndex === -1) {
          throw new Error(`unexpected EOF starts at ${startIndex}`);
        }
        const chunk = expression.substring(startIndex + 1, endIndex).trim();
        if (!chunk) {
          throw new Error(`source name is required at ${startIndex}`);
        }
        const pipeIndex = chunk.indexOf('|');
        if (pipeIndex === -1) {
          results.push({ type: 'source', name: chunk, format: '%d' });
        } else {
          results.push({
            type: 'source',
            name: chunk.substring(0, pipeIndex).trim(),
            format: chunk.substring(pipeIndex + 1).trim(),
          });
        }
        lastIndex = endIndex + 1;
      }
    }
    return results.filter((r) => r.type === 'source' || r.value);
  }

  current(): string {
    return this.model.value;
  }

  next(): string {
    this.parsedExpression.forEach((t) => {
      t.type === 'source' && this.sources.get(t.name)!.next();
    });
    let now: Date;
    this.model.value = this.parsedExpression.map((t) => {
      if (t.type === 'literal') {
        return strftime(t.value, (now ||= new Date()));
      } else {
        return sprintf(t.format, this.sources.get(t.name)!.current());
      }
    }).join('');
    return this.model.value;
  }
}
