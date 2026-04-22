---
title: "How to Size FreeRTOS Task Stacks Without Guessing"
date: 2024-08-12
description: "A practical, measurement-driven guide to determining correct FreeRTOS task stack sizes using uxTaskGetStackHighWaterMark and static analysis."
tags: ["FreeRTOS", "RTOS", "C", "embedded", "debugging"]
category: "Firmware"
categories: ["firmware"]
---

Every FreeRTOS project I have seen has at least one task with a stack that is either dangerously small or wastefully large. Here is a reproducible, measurement-driven method that works without guessing.

## Why stacks overflow silently

FreeRTOS fills unused stack space with `0xA5` on task creation. When the stack overflows it corrupts the adjacent region — usually another task's TCB. The crash appears unrelated to the overflowing task, making it one of the harder bugs to diagnose.

{{< note type="warning" >}}
`configCHECK_FOR_STACK_OVERFLOW` modes 1 and 2 catch *some* overflows but not all. A task can overflow mid-execution and recover before the hook runs.
{{< /note >}}

## Step 1 — Enable the high water mark API

```c
/* FreeRTOSConfig.h */
#define INCLUDE_uxTaskGetStackHighWaterMark  1
```

## Step 2 — Instrument your monitor task

```c
void vMonitorTask(void *pvParameters)
{
    (void)pvParameters;
    for (;;) {
        UBaseType_t hwm = uxTaskGetStackHighWaterMark(xMyTask);
        /* hwm = remaining words (4 bytes each on Cortex-M) */
        LOG_INF("MyTask stack HWM: %u words free", (unsigned)hwm);
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}
```

Run the system through every realistic workload scenario — startup, peak interrupt load, error recovery paths.

## Step 3 — Apply the sizing formula

```
stack_words = (initial_size - hwm_minimum) × safety_margin
```

I use a **safety margin of 1.5×** for development builds and **1.25×** for production (where you have completed integration testing). Round up to the nearest 32 words for alignment.

## Step 4 — Validate with static analysis

[Stack Analyser](https://www.absint.com/stackanalyzer/) and GCC's `-fstack-usage` flag can bound the call-graph depth statically:

```bash
arm-none-eabi-gcc -fstack-usage -O2 -c task_comms.c
cat task_comms.su   # per-function stack frame sizes
```

Combine with `cflow` or a custom Python script to walk the call graph from each task entry point.

## Summary

| Method | Catches overflow? | Gives minimum size? |
|--------|:-----------------:|:-------------------:|
| `uxTaskGetStackHighWaterMark` | No | Yes (dynamic) |
| `configCHECK_FOR_STACK_OVERFLOW` | Partially | No |
| `-fstack-usage` + call graph | No | Yes (static) |
| **Combined** | **Partially** | **Yes** |

The dynamic and static methods are complementary. Use both.
