# Task workflows

Implemented in the existing chat components: choose Ask/Plan/Summarize/Analyze, configure optional instructions, explicitly load the local model, then run a text task. Real run records carry running/completed/failed state and measured elapsed time. A run completes only after the generator returns nonempty text. Errors keep result null and restore the input; duplicate concurrent execution is rejected. Up to 20 run records are kept in memory (not durable accounts/history). No charts or fabricated metrics.

This is local foreground text execution, NOT a deployed agent, scheduler, tool runner or connected-service workflow. Image generation, code execution and account actions remain unavailable. The small local model's quality and actual generated turn remain unverified in this environment. Mock transport tests establish lifecycle correctness, not inference success.

19 Node tests/build pass. Real Chromium checked task selection, instructions, disabled run before readiness, actual no-GPU load failure and responsive width. No fake output was inserted. Hosted/model-success paths still need verification; no model-download network access provisioned. Styling is unchanged for this workflow implementation; existing components reused.
