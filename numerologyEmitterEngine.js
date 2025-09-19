const { EventEmitter } = require('events');

const SYMBOLIC_PHASES = [
  {
    key: 'ignition',
    label: 'Ignition',
    symbol: '🔥',
    mantra: 'Spark decisive motion and invite momentum.',
    priorities: ['Start boldly', 'Name the vision', 'Document first metrics'],
  },
  {
    key: 'alignment',
    label: 'Alignment',
    symbol: '🧭',
    mantra: 'Aim the effort and align collaborators.',
    priorities: ['State intent', 'Assign roles', 'Clarify constraints'],
  },
  {
    key: 'cadence',
    label: 'Cadence',
    symbol: '🥁',
    mantra: 'Establish rhythm and repeat the promising moves.',
    priorities: ['Install rituals', 'Review logs', 'Track short wins'],
  },
  {
    key: 'structure',
    label: 'Structure',
    symbol: '🧱',
    mantra: 'Anchor systems that keep the initiative upright.',
    priorities: ['Model architecture', 'Stabilize processes', 'Note escalation paths'],
  },
  {
    key: 'illumination',
    label: 'Illumination',
    symbol: '💡',
    mantra: 'Surface insights and teach the pattern.',
    priorities: ['Share updates', 'Broadcast learnings', 'Record reflections'],
  },
  {
    key: 'expansion',
    label: 'Expansion',
    symbol: '🌱',
    mantra: 'Grow the footprint and invite new collaborators.',
    priorities: ['Recruit advocates', 'Branch experiments', 'Map dependencies'],
  },
  {
    key: 'integration',
    label: 'Integration',
    symbol: '🪢',
    mantra: 'Connect scattered strands into a cohesive thread.',
    priorities: ['Merge insights', 'Refine playbooks', 'Update KPIs'],
  },
  {
    key: 'fortification',
    label: 'Fortification',
    symbol: '🛡️',
    mantra: 'Protect the gains and rehearse contingencies.',
    priorities: ['Stress test systems', 'Audit safeguards', 'Reinforce identity'],
  },
  {
    key: 'ascension',
    label: 'Ascension',
    symbol: '🚀',
    mantra: 'Elevate perspective and plan the next climb.',
    priorities: ['Synthesize cycle', 'Celebrate milestones', 'Stage next initiation'],
  },
];

function dayOfYear(date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date - start;
  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
}

function phaseClock(inputDate = new Date()) {
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayIndex = (dayOfYear(utcDate) - 1) % SYMBOLIC_PHASES.length;
  const cycleCount = Math.floor((dayOfYear(utcDate) - 1) / SYMBOLIC_PHASES.length) + 1;
  const phase = SYMBOLIC_PHASES[dayIndex];

  return {
    ...phase,
    cycleDay: dayIndex + 1,
    cycleLength: SYMBOLIC_PHASES.length,
    cycleCount,
    summary: `${phase.symbol}  Day ${dayIndex + 1} · ${phase.label}: ${phase.mantra}`,
    timestamp: utcDate,
  };
}

class NumerologyEmitterEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    this.middleware = [];
    this.phaseResolver = options.phaseResolver || phaseClock;
  }

  registerMiddleware(handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Middleware must be a function');
    }

    this.middleware.push(handler);
    return () => {
      this.middleware = this.middleware.filter((fn) => fn !== handler);
    };
  }

  use(handler) {
    return this.registerMiddleware(handler);
  }

  withPhase(date) {
    return this.phaseResolver(date);
  }

  runMiddlewares(context) {
    return this.middleware.reduce((acc, fn) => {
      const result = fn({ ...acc });
      if (result && typeof result === 'object') {
        const nextPayload = result.payload
          ? { ...acc.payload, ...result.payload }
          : acc.payload;
        return { ...acc, ...result, payload: nextPayload };
      }
      return acc;
    }, context);
  }

  emitSymbolic(eventName, payload = {}) {
    const phase = this.phaseResolver();
    const baseContext = {
      event: eventName,
      payload: { ...payload },
      timestamp: new Date(),
      phase,
      summary: `${phase.symbol}  ${eventName}`,
    };

    const context = this.runMiddlewares(baseContext);

    super.emit(eventName, context);

    if (eventName !== '*') {
      super.emit('*', context);
    }

    return context;
  }

  trackTask(taskName, meta = {}) {
    return this.emitSymbolic('task:tracked', {
      name: taskName,
      status: 'queued',
      ...meta,
    });
  }
}

module.exports = {
  NumerologyEmitterEngine,
  phaseClock,
  SYMBOLIC_PHASES,
};
