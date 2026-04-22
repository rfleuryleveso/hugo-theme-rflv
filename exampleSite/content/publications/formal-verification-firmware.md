---
title: "Automated Formal Verification of Safety-Critical Firmware Using CBMC and Frama-C"
date: 2023-09-10
authors: ["R. Fleury-Leveso", "L. Martin"]
venue: "IEEE International Symposium on Software Reliability Engineering (ISSRE) 2023"
doi: "10.1109/ISSRE.2023.00078"
abstract: "We describe a toolchain that applies Bounded Model Checking (CBMC) and Frama-C's WP plug-in to verify ISO 26262 ASIL-D firmware modules. A set of 12 production ECU drivers is verified for absence of buffer overflows, integer overflows, and null-pointer dereferences with a combined false-positive rate below 4%."
tags: ["formal verification", "CBMC", "Frama-C", "ISO 26262", "AUTOSAR", "safety-critical"]
category: "Safety & Verification"
featured: false
---

## Overview

Safety-critical embedded software developed under ISO 26262 (automotive) or DO-178C (avionics) requires rigorous verification. Traditional testing achieves structural coverage but cannot exhaustively prove absence of runtime errors. Formal methods fill this gap.

## Toolchain Architecture

```
Source (C99)
    │
    ▼
  Frama-C (value analysis + WP)
    │  ACSL annotations
    ▼
  CBMC (bounded model checker)
    │  counterexamples
    ▼
  Report generator → JIRA tickets
```

{{< note type="warning" >}}
CBMC's default loop unrolling bound must be tuned per driver; setting it too low produces spurious verification failures.
{{< /note >}}

## Results

All 12 drivers passed verification with an average analysis time of 4.2 minutes per module on a standard workstation.
