/*
 * @since 2021-05-16 14:08:14
 * @author junbao <junbao@mymoement.com>
 */

import { CronExpression, parseExpression } from 'cron-parser';
import { JSONValue } from './types';

export interface AutoIncrementSourceOptions {
  name: string;
  type: 'random-float' | 'random-int' | 'range';
  minValue: number;
  maxValue: number;

  initialValue: number;
  stepValue: number;
  maxStep: number;
  resetPeriod: string | null;
}

export interface AutoIncrementSourceModel extends AutoIncrementSourceOptions {
  value: number;
  createdAt: Date;
  executeCount: number;
  executedAt: Date;
}

export class AutoIncrementSource {
  model: AutoIncrementSourceModel;
  resetPeriodExpression: CronExpression | null;

  constructor(model: JSONValue<AutoIncrementSourceModel>) {
    this.model = {
      ...model,
      createdAt: new Date(model.createdAt),
      executedAt: new Date(model.executedAt),
    };
    if (model.resetPeriod) {
      this.resetPeriodExpression = parseExpression(model.resetPeriod);
    } else {
      this.resetPeriodExpression = null;
    }
  }

  current(): number {
    return this.model.value;
  }

  next(): number {
    throw new Error('not implemented');
  }
}
