import { useState } from "react";

export default function ISO45001Assessment() {
  const [answers, setAnswers] = useState({
    hazards: false,
    consultation: false,
    incident: false
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">ISO 45001 — OH&S Management Assessment</h2>
      <p className="text-sm text-gray-600">
        Quick self-check for a few key ISO 45001 areas.
      </p>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={answers.hazards}
          onChange={e => setAnswers(a => ({ ...a, hazards: e.target.checked }))}
        />
        Hazard identification & risk assessment implemented.
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={answers.consultation}
          onChange={e => setAnswers(a => ({ ...a, consultation: e.target.checked }))}
        />
        Worker consultation & participation in place.
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={answers.incident}
          onChange={e => setAnswers(a => ({ ...a, incident: e.target.checked }))}
        />
        Incident reporting & investigation procedure maintained.
      </label>

      <div className="mt-4 rounded border p-3">
        <div className="font-medium">Readiness score</div>
        <div className="text-2xl">
          {Object.values(answers).filter(Boolean).length} / 3
        </div>
      </div>
    </div>
  );
}
