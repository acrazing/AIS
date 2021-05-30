/*
 * @since 2021-05-30 12:35:23
 * @author junbao <junbao@mymoement.com>
 */

import { AutoIncrementSource } from './AutoIncrementSource';
import { GenerateLog } from './GenerateLog';
import { OrderedMap } from './OrderedMap';
import { SerialNumber } from './SerialNumber';

export class AISManager {
  readonly sources = new OrderedMap<string, AutoIncrementSource>();
  readonly serials = new OrderedMap<string, SerialNumber>();
  readonly generateLogs: GenerateLog[] = [];

  constructor() {
  }
}
