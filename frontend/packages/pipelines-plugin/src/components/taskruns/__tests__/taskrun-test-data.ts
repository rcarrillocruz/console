import { TaskRunKind } from '../../../types';

export const failedTaskRun: TaskRunKind = {
  kind: 'TaskRun',
  metadata: { name: 'abhi', namespace: 'abhi1' },
  status: {
    completionTime: '2019-10-29T11:57:53Z',
    conditions: [
      {
        lastTransitionTime: '2019-10-29T11:57:53Z',
        reason: 'Failed',
        status: 'True',
        type: 'Failed',
      },
    ],
  },
  spec: {},
};

export const successTaskRun: TaskRunKind = {
  kind: 'TaskRun',
  metadata: { name: 'abhi', namespace: 'abhi1' },
  status: {
    completionTime: '2019-10-29T11:57:53Z',
    conditions: [
      {
        lastTransitionTime: '2019-10-29T11:57:53Z',
        reason: 'Succeeded',
        status: 'True',
        type: 'Succeeded',
      },
    ],
  },
  spec: {},
};

export const taskRunWithResults: TaskRunKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'TaskRun',
  metadata: {
    name: 'sum-three-pipeline-run-second-add-vbr96',
  },
  spec: {
    params: [
      {
        name: 'first',
        value: '20',
      },
      {
        name: 'second',
        value: '10',
      },
    ],
    serviceAccountName: 'pipeline',
    taskRef: {
      kind: 'Task',
      name: 'add-task',
    },
    timeout: '1h0m0s',
  },
  status: {
    completionTime: '2021-02-09T09:57:03Z',
    conditions: [
      {
        lastTransitionTime: '2021-02-09T09:57:03Z',
        message: 'All Steps have completed executing',
        reason: 'Succeeded',
        status: 'True',
        type: 'Succeeded',
      },
    ],
    taskResults: [
      {
        name: 'sum',
        value: '30',
      },
      {
        name: 'difference',
        value: '10',
      },
      {
        name: 'multiply',
        value: '200',
      },
      {
        name: 'divide',
        value: '2',
      },
    ],
  },
};

export const failedTaskRunWithResults: TaskRunKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'TaskRun',
  metadata: {
    name: 'sum-three-pipeline-run-second-add-vbr96',
  },
  spec: {
    params: [
      {
        name: 'first',
        value: '20',
      },
      {
        name: 'second',
        value: '10',
      },
    ],
    serviceAccountName: 'pipeline',
    taskRef: {
      kind: 'Task',
      name: 'add-task',
    },
    timeout: '1h0m0s',
  },
  status: {
    completionTime: '2019-10-29T11:57:53Z',
    conditions: [
      {
        lastTransitionTime: '2019-10-29T11:57:53Z',
        reason: 'Failed',
        status: 'True',
        type: 'Failed',
      },
    ],
    taskResults: [
      {
        name: 'sum',
        value: '30',
      },
      {
        name: 'difference',
        value: '10',
      },
      {
        name: 'multiply',
        value: '200',
      },
      {
        name: 'divide',
        value: '2',
      },
    ],
  },
};
