# Bugfix Requirements Document

## Introduction

When a user's zone only supports a subset of verticals (e.g. only `society_fresh`), the application currently ignores that constraint and defaults to `daily_fresh` via `VerticalContext::current()`. This results in the user landing on a vertical their zone does not support, seeing an empty catalog. The fix must auto-switch the active vertical to the first one supported by the user's zone whenever the resolved vertical is unsupported, and must hide unsupported vertical toggle buttons in the Header so users cannot manually switch to an unsupported vertical.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user's zone supports only `society_fresh` and no explicit `?vertical=` query param is present THEN the system resolves `daily_fresh` as the current vertical (the hardcoded default) and stores it in the session

1.2 WHEN a user's zone supports only `society_fresh` and the session already contains `daily_fresh` from a previous visit THEN the system returns `daily_fresh` without checking zone compatibility, resulting in an empty catalog

1.3 WHEN a user's zone supports only `society_fresh` THEN the Header component renders both vertical toggle buttons as active/clickable, allowing the user to select `daily_fresh` even though it is unsupported

### Expected Behavior (Correct)

2.1 WHEN a user's zone supports only `society_fresh` and no explicit `?vertical=` query param is present THEN the system SHALL resolve `society_fresh` as the current vertical and store it in the session

2.2 WHEN a user's zone supports only `society_fresh` and the session contains `daily_fresh` THEN the system SHALL override the session value with `society_fresh` (the first supported vertical) and return it

2.3 WHEN a user's zone supports only `society_fresh` THEN the Header component SHALL hide or disable the `daily_fresh` toggle button so the user cannot switch to an unsupported vertical

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user's zone supports both `daily_fresh` and `society_fresh` (or has an empty verticals array) THEN the system SHALL CONTINUE TO resolve the vertical from the query param, then session, then the `daily_fresh` default — unchanged

3.2 WHEN a user explicitly passes `?vertical=society_fresh` and their zone supports `society_fresh` THEN the system SHALL CONTINUE TO honour the query param and store it in the session

3.3 WHEN a user explicitly passes `?vertical=daily_fresh` and their zone supports `daily_fresh` THEN the system SHALL CONTINUE TO honour the query param and store it in the session

3.4 WHEN no zone is resolved for the user (unauthenticated or no default address) THEN the system SHALL CONTINUE TO fall back to `daily_fresh` as the default vertical without error

3.5 WHEN a user's zone supports both verticals THEN the Header component SHALL CONTINUE TO render both toggle buttons as active and clickable
