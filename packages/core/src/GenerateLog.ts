/*
 * @since 2021-05-30 12:52:54
 * @author junbao <junbao@mymoement.com>
 */

import { JSONValue } from './types';

export interface GenerateLogModel {
  serialNumberName: string;
  value: string;
  createdAt: Date;
}

export class GenerateLog {
  model: GenerateLogModel;

  constructor(model: JSONValue<GenerateLogModel>) {
    this.model = {
      ...model,
      createdAt: new Date(model.createdAt),
    };
  }
}
