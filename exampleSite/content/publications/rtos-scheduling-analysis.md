---
title: "Worst-Case Response Time Analysis for Mixed-Criticality Task Sets on Cortex-M Microcontrollers"
date: 2024-03-15
authors: ["R. Fleury-Leveso", "A. Dupont", "M. Chen"]
venue: "IEEE Real-Time Systems Symposium (RTSS) 2024"
doi: "10.1109/RTSS.2024.00042"
pdf: ""
abstract: "We present a novel worst-case response-time (WCRT) analysis framework for mixed-criticality task sets executing on ARM Cortex-M4 microcontrollers under a fixed-priority preemptive scheduler. Our approach accounts for hardware-induced non-determinism from the data cache, pipeline stalls, and DMA contention. We validate our bounds against cycle-accurate simulation and demonstrate a reduction in analysis pessimism of up to 23% compared to state-of-the-art methods."
tags: ["RTOS", "scheduling", "real-time", "ARM", "Cortex-M", "WCET", "mixed-criticality"]
featured: true
---

## I. Introduction

Mixed-criticality systems combine tasks with different safety-integrity levels (SILs) on a single processing platform. In automotive and avionics domains, this consolidation reduces cost and weight but introduces complex scheduling challenges: a high-criticality task must meet its deadline regardless of the behaviour of lower-criticality co-runners.

{{< abstract >}}
We present a novel worst-case response-time (WCRT) analysis framework for mixed-criticality task sets executing on ARM Cortex-M4 microcontrollers under a fixed-priority preemptive scheduler. Our approach accounts for hardware-induced non-determinism from the data cache, pipeline stalls, and DMA contention.
{{< /abstract >}}

## II. System Model

We consider a task set $\Gamma = \{\tau_1, \ldots, \tau_n\}$ where each task $\tau_i = (C_i, T_i, D_i, \chi_i)$ is characterised by its worst-case execution time, period, relative deadline, and criticality level.

{{< note type="note" >}}
All experiments were performed on a STM32F407 running at 168 MHz with the data cache enabled.
{{< /note >}}

## III. Hardware Model

### A. Pipeline Stalls

The Cortex-M4 features a 3-stage in-order pipeline. Load-use hazards introduce a 1-cycle bubble per dependent load instruction. We model this with a static annotation pass over the compiled binary.

### B. DMA Contention

When a DMA transfer is active on the AHB bus matrix, CPU instruction fetches may stall for up to *N* cycles depending on burst length and arbitration priority.

```c
/* Configure DMA priority to avoid stalling high-crit tasks */
DMA2_Stream0->CR &= ~DMA_SxCR_PL_Msk;
DMA2_Stream0->CR |= DMA_PRIORITY_LOW;  /* low-criticality streams only */
```

## IV. Evaluation

| Task Set | Previous WCRT (µs) | Our WCRT (µs) | Reduction |
|----------|--------------------|---------------|-----------|
| TS-1     | 412                | 318           | 22.8%     |
| TS-2     | 879                | 691           | 21.4%     |
| TS-3     | 1204               | 923           | 23.3%     |

## V. Conclusion

Our hardware-aware WCRT analysis reduces pessimism compared to prior work while remaining safe. Future work will extend the model to multi-core Cortex-M55 devices with shared L2 cache.

{{< doi "10.1109/RTSS.2024.00042" >}}
