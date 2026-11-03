# Editor app

The editor opens and validates a scene-plan.json using the shared contract. It provides structured review and editing for the plan fields exposed by the current interface, including scene selection, timeline navigation, layout and visual choices, camera motion, and supported visual-element and sound controls.

The scene plan remains the source of truth. Do not replace it with presentation-only HTML or advertise controls that do not update the structured plan.

Run from the repository root:

~~~bash
bun --filter @sfe/editor dev
~~~

Build:

~~~bash
bun --filter @sfe/editor build
~~~
