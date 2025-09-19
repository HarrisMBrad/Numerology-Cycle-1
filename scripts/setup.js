#!/usr/bin/env node

const path = require('path');
const { NumerologyEmitterEngine, phaseClock } = require('../numerologyEmitterEngine');

const engine = new NumerologyEmitterEngine();

engine.use((context) => ({
  logStamp: `[${context.phase.symbol}] ${context.event} :: ${context.timestamp.toISOString()}`,
}));

engine.on('setup:phase-clocked', (context) => {
  const summary = context.payload.summary || context.phase.summary || context.summary;
  console.log(`Phase clock emitted → ${summary}`);
  console.log('');
});

const todayPhase = phaseClock();

const tasks = [
  {
    name: 'Review Cycle-1 KPI log',
    detail: 'Confirm today\'s anchor metric and intention.',
  },
  {
    name: 'Update identity tracker',
    detail: `Log a presence reflection in ${path.join('identity-tracker')}.`,
  },
  {
    name: 'Plan Numerology outreach',
    detail: 'Schedule one action that amplifies the Cycle-1 initiative.',
  },
];

const checklist = [
  'Open leader-day.html for a quick tone reset.',
  'Archive supporting artifacts into logs/ if they are complete.',
  'Run `node scripts/setup.js` tomorrow to maintain cadence.',
];

function printHeader() {
  console.log('🔮 Numerology Cycle 1 — Daily Setup');
  console.log(todayPhase.summary);
  console.log('Focus priorities:');
  todayPhase.priorities.forEach((priority, index) => {
    console.log(`  ${index + 1}. ${priority}`);
  });
  console.log('');
}

function printTasks() {
  console.log('Tasks queued:');
  tasks.forEach((task) => {
    const context = engine.trackTask(task.name, { detail: task.detail });
    console.log(`  • ${task.name}`);
    if (task.detail) {
      console.log(`    ↳ ${task.detail}`);
    }
    if (context.logStamp) {
      console.log(`    ${context.logStamp}`);
    }
  });
  console.log('');
}

function printChecklist() {
  console.log('Checklist:');
  checklist.forEach((item) => {
    console.log(`  [ ] ${item}`);
  });
}

printHeader();
printTasks();
engine.emitSymbolic('setup:phase-clocked', {
  phase: todayPhase,
  summary: todayPhase.summary,
});
printChecklist();
