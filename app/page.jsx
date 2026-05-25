"use client";

import { useMemo, useState } from "react";

const formulas = [
  {
    id: "binomial",
    name: "(a+b)^2",
    expression: "(a+b)^2 = a^2 + 2ab + b^2",
    description: "A square split into a^2, two ab rectangles, and b^2.",
  },
  {
    id: "sine",
    name: "Sine graph",
    expression: "y = A sin(kx + phi)",
    description: "Wave height, frequency, and phase all move the curve.",
  },
  {
    id: "cosine",
    name: "Cos graph",
    expression: "y = A cos(kx + phi)",
    description: "The cosine wave starts at a peak when phase is zero.",
  },
  {
    id: "euler",
    name: "Euler constant graph",
    expression: "y = e^(kx)",
    description: "Euler's number e makes a natural exponential curve.",
  },
  {
    id: "derivative",
    name: "Derivative tangent",
    expression: "f(x)=mx^2+c, f'(x)=2mx",
    description: "Drag x to see the tangent slope change on the curve.",
  },
  {
    id: "integration",
    name: "Integration area",
    expression: "Integral from p to q of (mx+b) dx",
    description: "The shaded region approximates accumulated area.",
  },
];

const controlSets = {
  binomial: [
    { key: "a", label: "a", min: 1, max: 9, step: 0.5, defaultValue: 4 },
    { key: "b", label: "b", min: 1, max: 9, step: 0.5, defaultValue: 3 },
  ],
  sine: [
    { key: "amplitude", label: "Amplitude", min: 0.5, max: 3, step: 0.1, defaultValue: 1.4 },
    { key: "frequency", label: "Frequency", min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
    { key: "phase", label: "Phase", min: -3.14, max: 3.14, step: 0.1, defaultValue: 0 },
  ],
  cosine: [
    { key: "amplitude", label: "Amplitude", min: 0.5, max: 3, step: 0.1, defaultValue: 1.2 },
    { key: "frequency", label: "Frequency", min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
    { key: "phase", label: "Phase", min: -3.14, max: 3.14, step: 0.1, defaultValue: 0 },
  ],
  euler: [
    { key: "growth", label: "Growth k", min: 0.25, max: 1.75, step: 0.05, defaultValue: 1 },
    { key: "scale", label: "Vertical scale", min: 0.4, max: 1.5, step: 0.05, defaultValue: 0.8 },
  ],
  derivative: [
    { key: "m", label: "Curve m", min: -1.5, max: 1.5, step: 0.1, defaultValue: 0.6 },
    { key: "c", label: "Height c", min: -2, max: 2, step: 0.1, defaultValue: -0.8 },
    { key: "x", label: "Point x", min: -3, max: 3, step: 0.1, defaultValue: 1 },
  ],
  integration: [
    { key: "m", label: "Slope m", min: -1, max: 1.5, step: 0.1, defaultValue: 0.5 },
    { key: "b", label: "Offset b", min: -1, max: 2.5, step: 0.1, defaultValue: 0.8 },
    { key: "p", label: "Start p", min: -3, max: 2, step: 0.1, defaultValue: -1.2 },
    { key: "q", label: "End q", min: -2, max: 3, step: 0.1, defaultValue: 1.8 },
  ],
};

function defaultsFor(id) {
  return Object.fromEntries(controlSets[id].map((control) => [control.key, control.defaultValue]));
}

function valueLabel(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function mapX(x) {
  return 40 + ((x + 4) / 8) * 560;
}

function mapY(y) {
  return 180 - (y / 4) * 140;
}

function linePath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ");
}

function axis() {
  return (
    <g className="text-slate-300 dark:text-slate-600">
      <line x1="40" x2="600" y1="180" y2="180" stroke="currentColor" strokeWidth="1.5" />
      <line x1="320" x2="320" y1="34" y2="326" stroke="currentColor" strokeWidth="1.5" />
      {[-3, -2, -1, 1, 2, 3].map((tick) => (
        <g key={tick}>
          <line x1={mapX(tick)} x2={mapX(tick)} y1="175" y2="185" stroke="currentColor" />
          <line x1="315" x2="325" y1={mapY(tick)} y2={mapY(tick)} stroke="currentColor" />
        </g>
      ))}
    </g>
  );
}

function BinomialVisual({ values }) {
  const { a, b } = values;
  const total = a + b;
  const size = 280;
  const aSize = (a / total) * size;
  const bSize = size - aSize;
  const result = total * total;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
      <div className="flex min-h-[340px] items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute left-0 top-0 grid place-items-center border border-teal-900/20 bg-teal-500/75 text-sm font-semibold text-teal-950"
            style={{ width: aSize, height: aSize }}
          >
            a^2
          </div>
          <div
            className="absolute top-0 grid place-items-center border border-cyan-900/20 bg-cyan-400/75 text-sm font-semibold text-cyan-950"
            style={{ left: aSize, width: bSize, height: aSize }}
          >
            ab
          </div>
          <div
            className="absolute left-0 grid place-items-center border border-amber-900/20 bg-amber-300/85 text-sm font-semibold text-amber-950"
            style={{ top: aSize, width: aSize, height: bSize }}
          >
            ab
          </div>
          <div
            className="absolute grid place-items-center border border-rose-900/20 bg-rose-300/80 text-sm font-semibold text-rose-950"
            style={{ left: aSize, top: aSize, width: bSize, height: bSize }}
          >
            b^2
          </div>
        </div>
      </div>
      <Summary
        lines={[
          `a = ${valueLabel(a)}, b = ${valueLabel(b)}`,
          `(a+b)^2 = ${valueLabel(result)}`,
          `a^2 + 2ab + b^2 = ${valueLabel(a * a + 2 * a * b + b * b)}`,
        ]}
      />
    </div>
  );
}

function WaveVisual({ values, type }) {
  const { amplitude, frequency, phase } = values;
  const points = Array.from({ length: 160 }, (_, index) => {
    const x = -4 + (index / 159) * 8;
    const wave = type === "sine" ? Math.sin(frequency * x + phase) : Math.cos(frequency * x + phase);
    return [mapX(x), mapY(amplitude * wave)];
  });

  return (
    <GraphFrame>
      {axis()}
      <path d={linePath(points)} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
      <text x="48" y="40" fontSize="14" className="fill-slate-600 dark:fill-slate-300">
        y = {valueLabel(amplitude)} {type === "sine" ? "sin" : "cos"}({valueLabel(frequency)}x + {valueLabel(phase)})
      </text>
    </GraphFrame>
  );
}

function EulerVisual({ values }) {
  const { growth, scale } = values;
  const points = Array.from({ length: 160 }, (_, index) => {
    const x = -3.5 + (index / 159) * 5.2;
    return [mapX(x), mapY(scale * Math.exp(growth * x))];
  });

  return (
    <GraphFrame>
      {axis()}
      <path d={linePath(points)} fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <circle cx={mapX(0)} cy={mapY(scale)} r="6" fill="#dc2626" />
      <text x="48" y="40" fontSize="14" className="fill-slate-600 dark:fill-slate-300">
        y = {valueLabel(scale)}e^({valueLabel(growth)}x)
      </text>
      <text x={mapX(0) + 10} y={mapY(scale) - 10} fontSize="13" className="fill-slate-600 dark:fill-slate-300">
        natural base e
      </text>
    </GraphFrame>
  );
}

function DerivativeVisual({ values }) {
  const { m, c, x } = values;
  const yAtX = m * x * x + c;
  const slope = 2 * m * x;
  const curvePoints = Array.from({ length: 160 }, (_, index) => {
    const pointX = -3.5 + (index / 159) * 7;
    return [mapX(pointX), mapY(m * pointX * pointX + c)];
  });
  const tangentPoints = [-1.4, 1.4].map((offset) => {
    const pointX = x + offset;
    const pointY = yAtX + slope * offset;
    return [mapX(pointX), mapY(pointY)];
  });

  return (
    <GraphFrame>
      {axis()}
      <path d={linePath(curvePoints)} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d={linePath(tangentPoints)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <circle cx={mapX(x)} cy={mapY(yAtX)} r="7" fill="#f59e0b" strokeWidth="3" className="stroke-white dark:stroke-slate-950" />
      <text x="48" y="40" fontSize="14" className="fill-slate-600 dark:fill-slate-300">
        slope f&apos;({valueLabel(x)}) = {valueLabel(slope)}
      </text>
    </GraphFrame>
  );
}

function IntegrationVisual({ values }) {
  const { m, b } = values;
  const start = Math.min(values.p, values.q);
  const end = Math.max(values.p, values.q);
  const curvePoints = Array.from({ length: 120 }, (_, index) => {
    const x = -3.5 + (index / 119) * 7;
    return [mapX(x), mapY(m * x + b)];
  });
  const areaTop = Array.from({ length: 50 }, (_, index) => {
    const x = start + (index / 49) * (end - start || 0.01);
    return [mapX(x), mapY(m * x + b)];
  });
  const polygon = [
    [mapX(start), mapY(0)],
    ...areaTop,
    [mapX(end), mapY(0)],
  ]
    .map((point) => point.join(","))
    .join(" ");
  const signedArea = 0.5 * m * (end * end - start * start) + b * (end - start);

  return (
    <GraphFrame>
      {axis()}
      <polygon points={polygon} fill="#14b8a6" opacity="0.28" />
      <path d={linePath(curvePoints)} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
      <line x1={mapX(start)} x2={mapX(start)} y1={mapY(0)} y2={mapY(m * start + b)} stroke="#0f766e" strokeDasharray="5 5" />
      <line x1={mapX(end)} x2={mapX(end)} y1={mapY(0)} y2={mapY(m * end + b)} stroke="#0f766e" strokeDasharray="5 5" />
      <text x="48" y="40" fontSize="14" className="fill-slate-600 dark:fill-slate-300">
        area = {valueLabel(signedArea)}
      </text>
    </GraphFrame>
  );
}

function GraphFrame({ children }) {
  return (
    <svg viewBox="0 0 640 360" className="h-full min-h-[340px] w-full rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <rect x="0" y="0" width="640" height="360" className="fill-white dark:fill-slate-950" />
      {children}
    </svg>
  );
}

function Summary({ lines }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Live values</p>
      <div className="space-y-3">
        {lines.map((line) => (
          <p key={line} className="rounded-md bg-white px-3 py-2 font-mono text-sm text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function Visual({ selectedId, values }) {
  if (selectedId === "binomial") return <BinomialVisual values={values} />;
  if (selectedId === "sine") return <WaveVisual values={values} type="sine" />;
  if (selectedId === "cosine") return <WaveVisual values={values} type="cosine" />;
  if (selectedId === "euler") return <EulerVisual values={values} />;
  if (selectedId === "derivative") return <DerivativeVisual values={values} />;
  return <IntegrationVisual values={values} />;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState("binomial");
  const [theme, setTheme] = useState("light");
  const [valuesByFormula, setValuesByFormula] = useState(() =>
    Object.fromEntries(formulas.map((formula) => [formula.id, defaultsFor(formula.id)]))
  );
  const selectedFormula = formulas.find((formula) => formula.id === selectedId);
  const selectedControls = controlSets[selectedId];
  const values = valuesByFormula[selectedId];
  const formulaIndex = useMemo(() => formulas.findIndex((formula) => formula.id === selectedId) + 1, [selectedId]);

  function updateValue(key, value) {
    setValuesByFormula((current) => ({
      ...current,
      [selectedId]: {
        ...current[selectedId],
        [key]: Number(value),
      },
    }));
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
            <div className="mb-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Formula Visualizer</p>
                <div className="flex rounded-md border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-950">
                  {["light", "dark"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTheme(option)}
                    className={`rounded px-2.5 py-1 text-xs font-semibold capitalize transition ${
                      theme === option
                        ? "bg-white text-slate-950 shadow-sm dark:bg-teal-400 dark:text-slate-950"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                    aria-pressed={theme === option}
                  >
                    {option}
                  </button>
                  ))}
                </div>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">Interactive math views</h1>
            </div>

            <div className="space-y-2">
              {formulas.map((formula) => {
                const active = formula.id === selectedId;
                return (
                  <button
                    key={formula.id}
                    type="button"
                    onClick={() => setSelectedId(formula.id)}
                    className={`w-full rounded-md border px-3 py-3 text-left transition ${
                      active
                        ? "border-teal-600 bg-teal-50 text-teal-950 dark:border-teal-400 dark:bg-teal-400/10 dark:text-teal-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{formula.name}</span>
                    <span className="mt-1 block truncate font-mono text-xs text-slate-500 dark:text-slate-400">{formula.expression}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Formula {formulaIndex} of {formulas.length}</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">{selectedFormula.name}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedFormula.description}</p>
                </div>
                <div className="rounded-md bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  {selectedFormula.expression}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <Visual selectedId={selectedId} values={values} />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Controls</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Slide values and watch the visual update.</p>
                </div>
                <div className="space-y-5">
                  {selectedControls.map((control) => (
                    <label key={control.key} className="block">
                      <span className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{control.label}</span>
                        <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                          {valueLabel(values[control.key])}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={values[control.key]}
                        onChange={(event) => updateValue(control.key, event.target.value)}
                        className="w-full"
                      />
                      <span className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        <span>{control.min}</span>
                        <span>{control.max}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
