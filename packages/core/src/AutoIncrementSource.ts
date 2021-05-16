/*
 * @since 2021-05-16 14:08:14
 * @author junbao <junbao@mymoement.com>
 */

import { CronExpression } from 'cron-parser';
import { JSONValue } from './types';

export class AutoIncrementSource {
  name: string;
  initialValue: number;
  stepValue: number;
  stopValue: number;
  resetPeriod: string | null;
  currentValue: number;
  createdAt: Date;
  executeCount: number;
  executedAt: Date;
  resetPeriodExpression: CronExpression | null;

  constructor(options: JSONValue<AutoIncrementSource>) {
  }

  current(): number {
    return this.currentValue;
  }

  next(): number {
  }
}
